const mongoose = require("mongoose");

const availabilitySchema = new mongoose.Schema({
    day: {
        type: String, // Monday, Tuesday...
        required: true
    },
    slots: [String] // ["10:00", "10:30"]
});

module.exports = mongoose.model("Availability", availabilitySchema);