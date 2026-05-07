const express = require("express");
const router = express.Router();
const Availability = require("../models/Availability");

// ✅ Set availability (replace or create)
router.post("/set", async (req, res) => {
    try {
        const { day, slots } = req.body;

        const updated = await Availability.findOneAndUpdate(
            { day },
            { slots },
            { upsert: true, new: true }
        );

        res.json({ message: "Availability updated", data: updated });

    } catch (err) {
        res.status(500).json({ message: "Error setting availability" });
    }
});

module.exports = router;

// Get all availability
router.get("/all", async (req, res) => {
    try {
        const data = await Availability.find().sort({ day: 1 });
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get availability for a specific day
router.get("/:day", async (req, res) => {
    try {
        const data = await Availability.findOne({ day: req.params.day });
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;