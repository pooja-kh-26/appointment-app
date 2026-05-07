const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const Availability = require("../models/Availability");
const BlockedDate = require("../models/BlockedDate");

// Delete all bookings
router.delete("/bookings", async (req, res) => {
    try {
        const result = await Booking.deleteMany({});
        res.json({
            message: "All bookings deleted successfully",
            deletedCount: result.deletedCount
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete all availability
router.delete("/availability", async (req, res) => {
    try {
        const result = await Availability.deleteMany({});
        res.json({
            message: "All availability deleted successfully",
            deletedCount: result.deletedCount
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete all blocked dates
router.delete("/blocked-dates", async (req, res) => {
    try {
        const result = await BlockedDate.deleteMany({});
        res.json({
            message: "All blocked dates deleted successfully",
            deletedCount: result.deletedCount
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete everything
router.delete("/all", async (req, res) => {
    try {
        const bookingResult = await Booking.deleteMany({});
        const availabilityResult = await Availability.deleteMany({});
        const blockedDateResult = await BlockedDate.deleteMany({});

        res.json({
            message: "All data cleared successfully",
            bookingsDeleted: bookingResult.deletedCount,
            availabilityDeleted: availabilityResult.deletedCount,
            blockedDatesDeleted: blockedDateResult.deletedCount
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
