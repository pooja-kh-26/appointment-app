const mongoose = require("mongoose");

const blockedDateSchema = new mongoose.Schema({
    date: {
        type: String, // "2026-05-01"
        required: true
    },
    blockedSlots: [String], // ["10:30"]
    isFullDayBlocked: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model("BlockedDate", blockedDateSchema);