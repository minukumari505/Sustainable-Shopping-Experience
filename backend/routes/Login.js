const express = require("express");
const router = express.Router();
const user = require("../storageSchema/user")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const cookie = require("cookie");


router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "no username or no passowrd"
            })
        }
        const checkuser = await user.findOne({ email });
        if (!checkuser) {
            return res.status(400).json({
                success: false,
                message: "wrong username"
            })
        }
        const passwordMatch = await bcrypt.compare(password, checkuser.password);
        if (!passwordMatch) {
            return res.status(400).json({
                success: false,
                message: "wrong password"
            })
        }
        const payload = {
            email,
            password
        }
        const secret_key = process.env.secret_key;
        const options = {
            expiresIn: '1h'
        }
        const jwttoken = await jwt.sign(payload, secret_key, options);

        // res.cookie(
        //     "jwtToken",
        //     jwttoken,
        //     {
        //      httpOnly:true,
        //      secure:true
        //     }
        // )
        // res.send("jwt token stroed in cookie")

        return res.status(200).json({
            success: true,
            message: "user logged in successfully",
            user: checkuser,
            token: jwttoken
        })

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error
        })
    }
})
module.exports = router;