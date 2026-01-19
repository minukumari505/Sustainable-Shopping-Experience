const express = require('express');
const router = express.Router();
const user = require("../storageSchema/user");
const bcrypt = require("bcrypt")
// const { default: SignUp } = require('../../src/pages/SignUp');

router.post("/signup", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "no username or no passowrd"
            })
        }
        const isSame = await user.findOne({ email });
        console.log("issame user : ", isSame);
        if (isSame) {
            return res.status(400).json({
                success: false,
                message: "Username Already Exists"
            })
        }
        const bcryptPassword = await bcrypt.hash(password, 12);
        const newuser = new user({ email, password: bcryptPassword });
        await newuser.save();

        return res.status(200).json({
            success: true,
            message: "User successfull Signed Up"
        })
    } catch (error) {
        console.error("Signup error:", err);         // ← log it!
        return res.status(500).json({                 // ← use 500
            success: false,
            message: "Something went wrong, please try again."
        });
    }

})

module.exports = router;
