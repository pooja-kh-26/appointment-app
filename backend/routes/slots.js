const express = require("express");
const router = express.Router();

const Availability = require("../models/Availability");
const BlockedDate = require("../models/BlockedDate");
const Booking = require("../models/Booking");

//Get available slots for a date
router.get("/:date", async (req, res) => {
    try {
        const date = req.params.date;

        // 1. Get default availability for the specific date
        const availability = await Availability.findOne({ day: date });

        if (!availability) {
            return res.json({ slots: [] });
        }

        let slots = availability.slots;

        //3. Check blocked data
        const blocked = await BlockedDate.findOne({ date });

        if (blocked) {
            //Full day blocked
            if (blocked.isFullDayBlocked) {
                return res.json({ slots: [] });
            }

            //Remove blocked slots
            slots = slots.filter(
                slot => !blocked.blockedSlots.includes(slot)
            );
        }

        // 4. Remove already booked slots
        const bookings = await Booking.find({ date });

        const bookedSlots = bookings.map(b => b.time);

        slots = slots.filter(
            slot => !bookedSlots.includes(slot)
        );

        // Final result
        res.json({ slots });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;