const express = require("express");
const router = express.Router();

const Booking = require("../models/Booking");
const Availability = require("../models/Availability");
const BlockedDate = require("../models/BlockedDate");


// ✅ Create booking with validation
router.post("/create", async (req, res) => {
    try {
        const {
            name,
            phone,
            email,
            gender,
            age,
            date,
            time
        } = req.body;

        // 🟢 0. Validate mandatory fields
        if (!phone || !email) {
            return res.status(400).json({
                message: "Phone number and email are required"
            });
        }

        // 🟢 1. Check availability
        const availability = await Availability.findOne({ day: date });

        if (!availability || !availability.slots.includes(time)) {
            return res.status(400).json({
                message: "Invalid or unavailable slot"
            });
        }

        // 🟢 3. Check blocked
        const blocked = await BlockedDate.findOne({ date });

        if (blocked) {
            if (blocked.isFullDayBlocked) {
                return res.status(400).json({
                    message: "This day is fully blocked"
                });
            }

            if (blocked.blockedSlots.includes(time)) {
                return res.status(400).json({
                    message: "This slot is blocked"
                });
            }
        }

        // 🟢 4. Check already booked
        const existing = await Booking.findOne({ date, time });

        if (existing) {
            return res.status(400).json({
                message: "Slot already booked"
            });
        }

        // 🟢 5. Save booking
        // 🟢 Save booking
        const newBooking = new Booking({
            name,
            phone,
            email,
            gender,
            age,
            date,
            time
        });

        await newBooking.save();

        // 🟢 Push to Google Apps Script Webhook (if configured)
        if (process.env.GOOGLE_SCRIPT_URL) {
            try {
                await fetch(process.env.GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name, age, gender, phone: `'${phone}`, email, date, time
                    })
                });
                console.log("Successfully sent to Google Sheet Webhook");
            } catch (webhookErr) {
                console.error("Webhook error:", webhookErr);
            }
        }

        // 🟢 Response
        res.json({
            message: "Booking successful",
            booking: newBooking
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ GET all bookings
router.get("/all", async (req, res) => {
    try {
        const bookings = await Booking.find().sort({ date: 1, time: 1 });
        res.json({ bookings });
    } catch (err) {
        res.status(500).json({ message: "Error fetching bookings" });
    }
});
module.exports = router;