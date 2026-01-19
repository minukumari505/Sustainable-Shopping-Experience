import pickle
import numpy as np
import pandas as pd 
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from difflib import get_close_matches

# Load your pickle bundle once at startup
with open("grade_predictor.pkl", "rb") as f:
    bundle = pickle.load(f)

rf_model     = bundle["model"]      

scaler       = bundle["scaler"]
label_enc    = bundle["encoder"]

feature_cols = bundle["features"]

# ─── LOAD RECOMMENDER BUNDLE ───────────────────────────────────────────────────
with open("recommendation_bundle.pkl", "rb") as f:
    reco = pickle.load(f)
# notice we match the keys you actually used:
df            = pd.DataFrame.from_records(reco["records"])
name_to_index = reco["name_to_index"]
sim_mat       = reco["sim_mat"]

app = FastAPI(title="Eco-Grade Predictor")

# ─── CORS ─────────────────────────────────────────────────────────────────────
# Allow your React app (or any origin) to call /predict
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],            # or ["http://localhost:3000"] for just your React dev server
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# ─── SCHEMAS ──────────────────────────────────────────────────────────────────
class Features(BaseModel):
    plastic_reduced_percent:      float = Field(..., example=84.0)
    chemical_used_percent:        float = Field(..., example=19.0)
    co2_emission_reduced_percent: float = Field(..., example=37.0)
    is_recyclable:                float = Field(..., example=1.0)
    biodegradable_percent:        float = Field(..., example=60.0)
    packaging_recyclable:         float = Field(..., example=1.0)
    water_used_liters:            float = Field(..., example=2.5)
    energy_used_kwh:              float = Field(..., example=0.1)
    product_weight_kg:            float = Field(..., example=0.75)
    product_lifespan_years:       float = Field(..., example=2.0)

# ─── ROUTES ───────────────────────────────────────────────────────────────────
@app.get("/")
async def read_root():
    return {"message": "Welcome to the Eco-Grade Prediction API!"}

@app.post("/predict")
async def predict(features: Features):
    # Build feature array in the order the model expects
    vals = [getattr(features, f) for f in feature_cols]
    row = np.array([vals])

    try:
        row_scaled = scaler.transform(row)
        code      = rf_model.predict(row_scaled)[0]
        label     = label_enc.inverse_transform([code])[0]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    return {"predicted_grade": label}



# ─── RECOMMENDATION ENDPOINT ────────────────────────────────────────────────
class RecoRequest(BaseModel):
    product_name: str = Field(..., example="MyBlush Women Top")
    top_n:        int = Field(5, example=5, description="How many to recommend")

    
@app.post("/recommend")
async def recommend(req: RecoRequest):
    raw = req.product_name.strip().lower()

    # 1) exact match
    if raw in name_to_index:
        key = raw
    else:
        labels = name_to_index.index  # these are your lowercase product names

        # 2) prefix match
        prefixes = [n for n in labels if n.startswith(raw)]
        if prefixes:
            key = prefixes[0]
        else:
            # 3) fuzzy match
            close = get_close_matches(raw, labels, n=1, cutoff=0.5)
            if close:
                key = close[0]
            else:
                raise HTTPException(
                    status_code=404,
                    detail=f"Product '{req.product_name}' not found in catalog."
                )

    idx = name_to_index[key]
    sims = list(enumerate(sim_mat[idx]))
    topn = sorted(sims, key=lambda x: x[1], reverse=True)[1 : req.top_n + 1]
    rec_idxs = [i for i, _ in topn]

    subset = df.iloc[rec_idxs][["_id", "productImage", "description"]]
    return {"recommendations": subset.to_dict(orient="records")}