const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const sendEmail = require("../utils/sendEmail");
const Booking = require("../models/Booking");
const Availability = require("../models/Availability");
const BlockedDate = require("../models/BlockedDate");

// ✅ Create booking with validation
router.post("/create", async (req, res) => {
    try {
        let {
            name,
            phone,
            email,
            gender,
            age,
            date,
            time
        } = req.body;

        // 🟢 Clean inputs (IMPORTANT)
        phone = phone?.trim();
        email = email?.trim();
        time = time?.trim();
        date = date?.trim();

        // 🟢 0. Validate mandatory fields
        if (!phone || !email || !date || !time) {
            return res.status(400).json({
                message: "Phone, email, date, and time are required"
            });
        }

        // 🟢 1. Check availability
        const availability = await Availability.findOne({ day: date });

        if (!availability || !availability.slots.includes(time)) {
            return res.status(400).json({
                message: "Invalid or unavailable slot"
            });
        }

        // 🟢 2. Check blocked dates/slots
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

        // 🟢 3. Check already booked
        const existing = await Booking.findOne({ date, time });

        if (existing) {
            return res.status(400).json({
                message: "Slot already booked"
            });
        }

        const roomName = `sutra-health-${uuidv4()}`;

        const meetingLink = `https://meet.jit.si/${roomName}`;

        // 🟢 4. Save booking
        const newBooking = new Booking({
            name,
            phone,
            email,
            gender,
            age,
            date,
            time,
            meetingLink
        });

        await newBooking.save();

        // ✅ Send email to patient
        await sendEmail(
            email,
            "Appointment Confirmed - Sutra Health",
            `
    <h2>Your appointment is confirmed</h2>

    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Date:</strong> ${date}</p>
    <p><strong>Time:</strong> ${time}</p>

    <p>
        <a href="${meetingLink}">
            Join Video Consultation
        </a>
    </p>
    `
        );

        // ✅ Send email to doctor
        await sendEmail(
            process.env.DOCTOR_EMAIL,
            "New Appointment Booked",
            `
    <h2>New Appointment Booked</h2>

    <p><strong>Patient:</strong> ${name}</p>
    <p><strong>Date:</strong> ${date}</p>
    <p><strong>Time:</strong> ${time}</p>

    <p>
        <a href="${meetingLink}">
            Join Video Consultation
        </a>
    </p>
    `
        );

        // 🟢 5. REMOVE SLOT FROM AVAILABILITY (CRITICAL FIX)
        await Availability.updateOne(
            { day: date },
            { $pull: { slots: time } }
        );

        // 🟢 6. Google Sheets webhook (safe optional call)
        if (process.env.GOOGLE_SCRIPT_URL) {
            try {
                await fetch(process.env.GOOGLE_SCRIPT_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name,
                        age,
                        gender,
                        phone: `'${phone}`,
                        email,
                        date,
                        time
                    })
                });

                console.log("Successfully sent to Google Sheet Webhook");
            } catch (webhookErr) {
                console.error("Webhook error:", webhookErr.message);
            }
        }

        // 🟢 Response
        return res.status(201).json({
            message: "Booking successful",
            booking: newBooking,
            meetingLink
        });

    } catch (error) {
        console.error("Booking error:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
});

// ✅ GET all bookings
router.get("/all", async (req, res) => {
    try {
        const bookings = await Booking.find().sort({ date: 1, time: 1 });

        return res.json({ bookings });

    } catch (err) {
        return res.status(500).json({
            message: "Error fetching bookings",
            error: err.message
        });
    }
});

module.exports = router;