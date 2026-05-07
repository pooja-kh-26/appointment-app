const express = require("express");
const router = express.Router();

const Booking = require("../models/Booking");

// 🟢 Get available dates (next 7 days example)
router.get("/", async (req, res) => {
    try {
        const bookings = await Booking.find();

        const bookedDates = [...new Set(bookings.map(b => b.date))];

        res.json({
            dates: bookedDates
        });

    } catch (err) {
        res.status(500).json({ message: "Error fetching dates" });
    }
});

module.exports = router;