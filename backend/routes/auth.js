const express = require("express");
const router = express.Router();

router.post("/login", (req, res) => {
    console.log("Entered password:", req.body.password);
    console.log("Env password:", process.env.ADMIN_PASSWORD);

    const { password } = req.body;

    if (password === process.env.ADMIN_PASSWORD) {
        return res.json({
            success: true
        });
    }

    return res.status(401).json({
        success: false,
        message: "Invalid password"
    });
});

module.exports = router;