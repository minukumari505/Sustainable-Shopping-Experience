import React, { useState, useEffect } from "react";
import EcoWheel from "./EcoWheel";
import { motion } from "framer-motion";
export default function SellerSection() {
  const btnVariants = {
    rest: {},
    hover: {
      scale: 1.05,
      boxShadow: "0 8px 24px rgba(46,125,50,0.3)",
    },
    tap: { scale: 0.95 },
  };
  
  const [formData, setFormData] = useState({
    productId: "",
    productName: "",
    category: "",
    price: "",
    grade:"",
    filters: {
      plasticFree: false,
      fscCertified: false,
      carbonNeutral: false,
      recycledMaterials: false,
    },
    productImage: null,
    manufacturingProcess: "",
    transportationMethod: "",
    materialsUsed: "",
    plasticReducedPercent: "",
    chemicalUsedPercent: "",
    co2ReducedPercent: "",
    isRecyclable: "",
    packagingRecyclable: "",
    biodegradablePercent: "",
    waterUsedLiters: "",
    energyUsedKwh: "",
    productWeightKg: "",
    productLifespanYears: "",
  });
  const [hovered, setHovered] = useState("");
  const [modalGrade, setModalGrade] = useState(null);

  // Toast state
  const [toast, setToast] = useState(null);
  const [toastVisible, setToastVisible] = useState(false);
  let toastTimer = null;
  const showToast = (message, type = "success") => {
    clearTimeout(toastTimer);
    setToast({ message, type });
    setToastVisible(true);
    toastTimer = setTimeout(() => setToastVisible(false), 3000);
  };

  // Handle field changes
  const handleChange = (e) => {
    const { name, type, value, files, checked } = e.target;
    if (name.startsWith("filters.")) {
      const key = name.split(".")[1];
      setFormData((p) => ({
        ...p,
        filters: { ...p.filters, [key]: checked },
      }));
    } else if (type === "file") {
      setFormData((p) => ({ ...p, [name]: files[0] }));
    } else {
      setFormData((p) => ({
        ...p,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  // Call FastAPI to predict
  const calculateGrade = async (e) => {
    e.preventDefault();
    const payload = {
      plastic_reduced_percent: Number(formData.plasticReducedPercent),
      chemical_used_percent: Number(formData.chemicalUsedPercent),
      co2_emission_reduced_percent: Number(formData.co2ReducedPercent),
      is_recyclable: Number(formData.isRecyclable),
      biodegradable_percent: Number(formData.biodegradablePercent),
      packaging_recyclable: Number(formData.packagingRecyclable),
      water_used_liters: Number(formData.waterUsedLiters),
      energy_used_kwh: Number(formData.energyUsedKwh),
      product_weight_kg: Number(formData.productWeightKg),
      product_lifespan_years: Number(formData.productLifespanYears),
    };

    try {
      const res = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Prediction failed");
      }
      const { predicted_grade } = await res.json();
      setModalGrade(predicted_grade);
      setFormData(f => ({ ...f, grade: predicted_grade }));
      showToast(`Eco grade: ${predicted_grade}`, "success");
    } catch (err) {
      console.error("Grade calc error:", err);
      showToast("Could not calculate grade", "error");
    }
  };

  // Submit the full product
  const handleSubmit = async (e) => {
    e.preventDefault();
    // basic validation
    for (let [k, v] of Object.entries(formData)) {
      if (k === "filters") continue;
      if (v === "" || v == null) {
        return showToast(`Please fill in ${k}`, "error");
      }
    }

    const payload = new FormData();
    [
      "productId",
      "productName",
      "category",
      "price",
      "grade",
      "manufacturingProcess",
      "transportationMethod",
      "materialsUsed",
      "plasticReducedPercent",
      "chemicalUsedPercent",
      "co2ReducedPercent",
      "isRecyclable",
      "packagingRecyclable",
      "biodegradablePercent",
      "waterUsedLiters",
      "energyUsedKwh",
      "productWeightKg",
      "productLifespanYears",
    ].forEach((field) => payload.append(field, formData[field]));

    Object.entries(formData.filters).forEach(([key, val]) =>
      payload.append(`filters.${key}`, val)
    );
    payload.append("productImage", formData.productImage);
    if (modalGrade) {
            payload.append("grade", modalGrade);
          }
    try {
      const res = await fetch("https://amazon-hackon-s2-buckets.vercel.app/addproduct", {
        method: "POST",
        body: payload,
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Server error");
      }
      const created = await res.json();
      showToast(`Product created!`, "success");
      // reset form
      setFormData({
        productId: "",
        productName: "",
        category: "",
        price: "",
        filters: {
          plasticFree: false,
          fscCertified: false,
          carbonNeutral: false,
          recycledMaterials: false,
        },
        productImage: null,
        manufacturingProcess: "",
        transportationMethod: "",
        materialsUsed: "",
        plasticReducedPercent: "",
        chemicalUsedPercent: "",
        co2ReducedPercent: "",
        isRecyclable: "",
        packagingRecyclable: "",
        biodegradablePercent: "",
        waterUsedLiters: "",
        energyUsedKwh: "",
        productWeightKg: "",
        productLifespanYears: "",
      });
    } catch (err) {
      console.error("Submit error:", err);
      showToast("Failed to create product", "error");
    }
  };

  // styles
  const cardStyle = (key) => ({
    background: "#fff",
    borderRadius: "16px",
    padding: "24px",
    marginBottom: "24px",
    borderLeft: "6px solid #66bb6a",                         // accent stripe
    boxShadow:
      hovered === key
        ? "0 12px 24px rgba(46,125,50,0.2)"                   // deeper hover shadow
        : "0 4px 12px rgba(0,0,0,0.08)",                      // normal
    transform: hovered === key ? "translateY(-6px)" : "translateY(0)", // lift on hover
    transition: "transform 0.3s ease, box-shadow 0.3s ease"    // smooth animations
  });
  
  
  const grid2 = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 16,
  };
 
  const modalBackdrop = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  };
  const modalBox = {
    background: "#fff",
    padding: 24,
    borderRadius: 8,
    textAlign: "center",
    minWidth: 280,
  };
  const toastStyle = {
    position: "fixed",
    left: "50%",
    transform: "translateX(-50%)",
    top: toastVisible ? 16 : -80,
    transition: "top 0.4s ease",
    background: "#fff",
    padding: "12px 20px",
    borderRadius: 4,
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    display: "flex",
    alignItems: "center",
    zIndex: 10000,
    minWidth: 280,
  };
  const container = {
  maxWidth: 960,
  margin: "40px auto",
  fontFamily: "'Montserrat', sans-serif",
  background: "linear-gradient(135deg, #eafaf4 0%, #f5fbf9 100%)",
  padding: "32px",
  borderRadius: "12px",
};

const heading = {
  fontSize: "2.4rem",
  fontWeight: 700,
  color: "#01332b",
  textAlign: "center",
  marginBottom: "32px",
};

const sectionTitle = {
  fontSize: 20,
  margin: "0 0 16px 0",
  borderLeft: "4px solid #01332b",
  paddingLeft: 8,
  color: " #33691E",

};

  const labelStyle = {
    display: "inline-block",
    marginBottom: "8px",
    marginTop: "12px",
    fontSize: "0.875rem",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    background: "linear-gradient(90deg, #81c784, #388e3c)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  };


const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  marginBottom: 12,
  borderRadius: 6,
  border: "1px solid #ddd",
  fontSize: 14,
  boxSizing: "border-box",
  fontWeight: 500,
  // color:'green',
  border: "2px solid #c8e6c9",        // light green border
  backgroundColor: "#f5fdfa",
};

  const buttonStyle = {
    display: "block",        // make it a block
    margin: "24px auto 0",   // top 24px, auto L/R, 0 bottom
    padding: "14px 28px",
    background: "linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "24px",
    fontSize: "1rem",
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(46,125,50,0.2)",
    transition: "background 0.3s ease, transform 0.2s ease, box-shadow 0.2s ease",
    marginBottom:'10px'
  };
  const sidebar = {
    
    color: "#006d5a",
    textDecoration: "none",
    fontWeight: 600,
    display: "flex",
    gap: "24px",
    listStyle: "none",
    padding: 0,
    marginBottom: "24px",
    marginLeft:'10%'
  };

  const link = {
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: 600,
    color: "#01332B",
    textDecoration: "none",
  };



  return (
    <div 
      style={{
        background: "linear-gradient(135deg, #eafaf4 0%, #f5fbf9 100%)",
      }}
    >
     <div style={{padding:20}}>

     </div>
      <nav>
        <ul style={{
          ...sidebar, color: "#006d5a",
          textDecoration: "none",
          fontWeight: 600,
      }}>
          <li>
            <a href="/green" style={link}>Home</a>
          </li>
          <li>
            <a href="/education" style={link}>Educational Section</a>
          </li>
          <li>
            <a href="/sustainability" style={link}>Sustainability Report</a>
          </li>
        </ul>
      </nav>
      <div
        style={{
          maxWidth:"80%",
          margin: " auto",
          fontFamily: "Arial, sans-serif",
          background: "linear-gradient(135deg, #eafaf4 0%, #f5fbf9 100%)",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            color: "#2e7d32",
           
            marginBottom: 32,
            
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 600
          }}
        >
          List Your Eco-Friendly Product
        </h1>


        <form onSubmit={handleSubmit}>
          {/* BASIC INFO */}
          <section
            onMouseEnter={() => setHovered("basic")}
            onMouseLeave={() => setHovered("")}
            style={cardStyle("basic")}
          >
            <h2 style={sectionTitle}>Basic Product Info</h2>
            <div style={grid2}>
              <div>
                <label style={labelStyle}>Product ID</label>
                <input
                  name="productId"
                  value={formData.productId}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="e.g. 3"
                />
              </div>
              <div>
                <label style={labelStyle}>Product Name</label>
                <input
                  name="productName"
                  value={formData.productName}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="e.g. Nimyle Eco Floor Cleaner"
                />
              </div>
              <div>
                <label style={labelStyle}>Category</label>
                <input
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="e.g. Cleaning"
                />
              </div>
              <div>
                <label style={labelStyle}>Price (USD)</label>
                <input
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="e.g. 12.49"
                />
              </div>
              <div>
                <label style={labelStyle}>Upload Product Image</label>
                <input
                  type="file"
                  name="productImage"
                  accept="image/*"
                  onChange={handleChange}
                  style={{ marginBottom: 12 }}
                />
                {formData.productImage && (
                  <img
                    src={URL.createObjectURL(formData.productImage)}
                    alt="preview"
                    style={{
                      width: "100%",
                      borderRadius: 6,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    }}
                  />
                )}
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>
                  Eco-Filters (check all that apply)
                </label>
                {[
                  "plasticFree",
                  "fscCertified",
                  "carbonNeutral",
                  "recycledMaterials",
                ].map((f) => (
                  <label key={f} style={{ marginRight: 16, fontSize: 14 }}>
                    <input
                      type="checkbox"
                      name={`filters.${f}`}
                      checked={formData.filters[f]}
                      onChange={handleChange}
                      style={{ marginRight: 6 }}
                    />
                    {f}
                  </label>
                ))}
              </div>
            </div>
          </section>

          {/* MANUFACTURING */}
          <section
            onMouseEnter={() => setHovered("manu")}
            onMouseLeave={() => setHovered("")}
            style={cardStyle("manu")}
          >
            <h2 style={sectionTitle}>Manufacturing Details</h2>
            <div style={grid2}>
              <div>
                <label style={labelStyle}>
                  Describe your manufacturing process
                </label>
                <input
                  name="manufacturingProcess"
                  value={formData.manufacturingProcess}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="e.g. Solar-powered, water-based infusion"
                />
              </div>
              <div>
                <label style={labelStyle}>Primary transportation method</label>
                <input
                  name="transportationMethod"
                  value={formData.transportationMethod}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="e.g. Truck, rail, sea"
                />
              </div>
              <div>
                <label style={labelStyle}>Materials used in product</label>
                <input
                  name="materialsUsed"
                  value={formData.materialsUsed}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="e.g. Bamboo, plant extracts"
                />
              </div>
            </div>
          </section>

          {/* ECO SPECS */}
          <section
            onMouseEnter={() => setHovered("eco")}
            onMouseLeave={() => setHovered("")}
            style={cardStyle("eco")}
          >
            <h2 style={sectionTitle}>Eco Specifications</h2>
            <div style={grid2}>
              <div>
                <label style={labelStyle}>
                  What % less plastic does this use vs. a standard competitor?
                </label>
                <input
                  type="number"
                  name="plasticReducedPercent"
                  value={formData.plasticReducedPercent}
                  onChange={handleChange}
                  style={inputStyle}
                  min="0"
                  max="100"
                />
              </div>
              <div>
                <label style={labelStyle}>
                  What % of the formula is synthetic chemicals vs. natural?
                </label>
                <input
                  type="number"
                  name="chemicalUsedPercent"
                  value={formData.chemicalUsedPercent}
                  onChange={handleChange}
                  style={inputStyle}
                  min="0"
                  max="100"
                />
              </div>
              <div>
                <label style={labelStyle}>
                  What % CO₂ reduction have you achieved (LCA or third-party
                  cert)?
                </label>
                <input
                  type="number"
                  name="co2ReducedPercent"
                  value={formData.co2ReducedPercent}
                  onChange={handleChange}
                  style={inputStyle}
                  min="0"
                  max="100"
                />
              </div>
              
              
              <div>
                <label style={labelStyle}>
                  What % of the ingredients / materials are biodegradable?
                </label>
                <input
                  type="number"
                  name="biodegradablePercent"
                  value={formData.biodegradablePercent}
                  onChange={handleChange}
                  style={inputStyle}
                  min="0"
                  max="100"
                />
              </div>
              <div>
                <label style={labelStyle}>
                  How many liters of water are required to manufacture one unit?
                </label>
                <input
                  type="number"
                  name="waterUsedLiters"
                  value={formData.waterUsedLiters}
                  onChange={handleChange}
                  style={inputStyle}
                  min="0"
                  step="0.1"
                />
              </div>
              <div>
                <label style={labelStyle}>
                  How many kWh of energy are required to manufacture one unit?
                </label>
                <input
                  type="number"
                  name="energyUsedKwh"
                  value={formData.energyUsedKwh}
                  onChange={handleChange}
                  style={inputStyle}
                  min="0"
                  step="0.1"
                />
              </div>
              <div>
                <label style={labelStyle}>
                  What is the weight of the product (in kilograms)?
                </label>
                <input
                  type="number"
                  name="productWeightKg"
                  value={formData.productWeightKg}
                  onChange={handleChange}
                  style={inputStyle}
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label style={labelStyle}>
                  What is the expected usable lifetime in years?
                </label>
                <input
                  type="number"
                  name="productLifespanYears"
                  value={formData.productLifespanYears}
                  onChange={handleChange}
                  style={inputStyle}
                  min="0"
                  step="0.1"
                />
              </div>
              <div>
                <label style={labelStyle}>
                  Is the product itself material-recyclable? (yes=1 / no=0)
                </label>
                <select
                  name="isRecyclable"
                  value={formData.isRecyclable}
                  onChange={handleChange}
                  style={inputStyle}
                >
                  <option value="">Select…</option>
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>
                  Is the packaging fully recyclable? (yes=1 / no=0)
                </label>
                <select
                  name="packagingRecyclable"
                  value={formData.packagingRecyclable}
                  onChange={handleChange}
                  style={inputStyle}
                >
                  <option value="">Select…</option>
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </div>
            </div>

            <div style={{ textAlign: "right", marginTop: 8 }}>
              <button
                type="button"
                onClick={(e) => calculateGrade(e)}
                style={{ ...buttonStyle, background: "#ffa000" }}
              >
                Calculate Eco Grade
              </button>
            </div>
            
          </section>

          <motion.button
            type="submit"
            style={buttonStyle}
            variants={btnVariants}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
          >
            Submit Product
          </motion.button>


        </form>

        {/* add these keyframes once at the top of your JSX return */}
        {modalGrade && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(0, 0, 0, 0.6)",
              backdropFilter: "blur(4px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              animation: "fadeInOverlay 0.3s ease forwards",
              zIndex: 1000,
            }}
          >
            <div
              style={{
                background: "#fff",
                borderRadius: 12,
                padding: 32,
                maxWidth: 360,
                width: "90%",
                boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                position: "relative",
                animation: "slideDownModal 0.35s ease-out forwards",
                textAlign: "center",
              }}
            >
              {/* close “×” */}
              <button
                onClick={() => setModalGrade(null)}
                style={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  background: "none",
                  border: "none",
                  fontSize: 20,
                  cursor: "pointer",
                  color: "#999",
                }}
                aria-label="Close"
              >
                ×
              </button>

              <h3 style={{
                margin: "0 0 16px",
                fontSize: 22,
                color: "#2e7d32"
              }}>
                Your Eco Rating
              </h3>

              {/* <-- HERE: render the wheel with the grade --> */}
              <div style={{ margin: "0 auto", width: 200, height: 200 }}>
                <EcoWheel grade={modalGrade} />
              </div>

              <button
                onClick={() => setModalGrade(null)}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "12px 0",
                  marginTop: 24,
                  background: "#2e7d32",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  fontSize: 16,
                  cursor: "pointer",
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}



        {toast && (
          <div style={toastStyle}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: toast.type === "success" ? "#4caf50" : "#f44336",
                color: "#fff",
                marginRight: 12,
                fontSize: 14,
              }}
            >
              {toast.type === "success" ? "✔️" : "❌"}
            </span>
            <span style={{ color: "#333", fontSize: 14 }}>
              {toast.message}
            </span>
            <button
              onClick={() => setToastVisible(false)}
              style={{
                marginLeft: "auto",
                border: "none",
                background: "transparent",
                fontSize: 16,
                cursor: "pointer",
                color: "#999",
              }}
            >
              ✕
            </button>
          </div>
        )}
      </div>
    </div>

   
  );
}
