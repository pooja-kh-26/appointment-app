const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    name: String,
    phone: { type: String, required: true },
    email: { type: String, required: true },
    gender: String,
    age: Number,
    date: String,
    time: String,
    meetLink: String
});

module.exports = mongoose.model("Booking", bookingSchema);