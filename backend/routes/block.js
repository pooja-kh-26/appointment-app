const express = require("express");
const router = express.Router();
const BlockedDate = require("../models/BlockedDate");


router.post("/add-slots", async (req, res) => {
    try {
        const { date, slots } = req.body;

        let existing = await BlockedDate.findOne({ date });

        if (!existing) {
            existing = new BlockedDate({
                date,
                blockedSlots: slots,
                isFullDayBlocked: false
            });
        } else {
            // merge without duplicates
            const updatedSlots = new Set([
                ...existing.blockedSlots,
                ...slots
            ]);
            existing.blockedSlots = [...updatedSlots];
        }

        await existing.save();

        res.json({ message: "Slots added to block list" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/remove-slots", async (req, res) => {
    try {
        const { date, slots } = req.body;

        let existing = await BlockedDate.findOne({ date });

        if (!existing) {
            return res.status(404).json({ message: "No blocked data found" });
        }

        existing.blockedSlots = existing.blockedSlots.filter(
            slot => !slots.includes(slot)
        );

        await existing.save();

        res.json({ message: "Slots removed from block list" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/toggle-day", async (req, res) => {
    try {
        const { date, isFullDayBlocked } = req.body;

        let existing = await BlockedDate.findOne({ date });

        if (!existing) {
            existing = new BlockedDate({
                date,
                blockedSlots: [],
                isFullDayBlocked
            });
        } else {
            existing.isFullDayBlocked = isFullDayBlocked;

            // optional: clear slots if full day blocked
            if (isFullDayBlocked) {
                existing.blockedSlots = [];
            }
        }

        await existing.save();

        res.json({ message: "Day block status updated" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get blocked info for a date
router.get("/:date", async (req, res) => {
    try {
        const data = await BlockedDate.findOne({ date: req.params.date });
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;