const express = require('express');
const multer = require('multer');
const path = require('path');
const Product = require('../storageSchema/ProductSchema');
const router = express.Router();

// 1) configure multer to write uploads into an "uploads" folder
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: (req, file, cb) => {
        // e.g. 1627381928371-<originalname>
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });

// 2) mount your JSON‐body parser for all non‐multipart routes
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// 3) your POST endpoint, now using multer.single()
router.post('/addproduct', upload.single('productImage'), async (req, res) => {
    try {
        // multer has placed the file metadata on req.file
        // text fields are on req.body
        const {
            productId,
            productName,
            category,
            price,
            grade,
            // productImage,
            manufacturingProcess,
            transportationMethod,
            materialsUsed,
            plasticReducedPercent,
            chemicalUsedPercent,
            co2ReducedPercent,
            isRecyclable,
            packagingRecyclable,
            biodegradablePercent,
            waterUsedLiters,
            energyUsedKwh,
            productWeightKg,
            productLifespanYears
        } = req.body;

        // simple required check
        if (!productId || !productName || !category || !price || !req.file) {
            return res.status(400).json({ error: 'Missing required fields.' });
        }

        // build your new doc
        const newProduct = new Product({
            productId,
            productName,
            category,
            price,
            grade,
            productImage: req.file.filename,      // store the local path or URL
            manufacturingProcess,
            transportationMethod,
            materialsUsed,
            plasticReducedPercent: Number(plasticReducedPercent),
            chemicalUsedPercent: Number(chemicalUsedPercent),
            co2ReducedPercent: Number(co2ReducedPercent),
            isRecyclable: Boolean(Number(isRecyclable)),
            packagingRecyclable: Boolean(Number(packagingRecyclable)),
            biodegradablePercent: Number(biodegradablePercent),
            waterUsedLiters: Number(waterUsedLiters),
            energyUsedKwh: Number(energyUsedKwh),
            productWeightKg: Number(productWeightKg),
            productLifespanYears: Number(productLifespanYears),
            filters: {
                plasticFree: req.body['filters.plasticFree'] === 'true',
                fscCertified: req.body['filters.fscCertified'] === 'true',
                carbonNeutral: req.body['filters.carbonNeutral'] === 'true',
                recycledMaterials: req.body['filters.recycledMaterials'] === 'true',
            }
        });

        await newProduct.save();
        return res.status(201).json(newProduct);

    } catch (err) {
        console.error('POST /addproduct error:', err);
        return res.status(500).json({ error: 'Server error while creating product.' });
    }
});



router.get('/getproducts', async (_req, res) => {
    try {
      const products = await Product.find().sort({ createdAt: -1 });
      return res.json(products);
    } catch (err) {
      console.error('GET /getproducts error:', err);
      // Return the real message so you can see it in Postman
      return res
        .status(500)
        .json({ error: 'Server error while fetching products.', detail: err.message });
    }
  });
  
module.exports = router;
