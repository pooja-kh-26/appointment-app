const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

app.get("/", (req, res) => {
    res.send("API is running...");
});

const Availability = require("./models/Availability");

app.get("/test", async (req, res) => {
    const data = await Availability.find();
    res.json(data);
});

const availabilityRoutes = require("./routes/availability");

app.use("/api/availability", availabilityRoutes);

const blockRoutes = require("./routes/block");

app.use("/api/block", blockRoutes);

const slotRoutes = require("./routes/slots");

app.use("/api/slots", slotRoutes);

const bookingRoutes = require("./routes/booking");

app.use("/api/booking", bookingRoutes);


const dateRoutes = require("./routes/dates");

app.use("/api/dates", dateRoutes);

const cleanupRoutes = require("./routes/cleanup");

app.use("/api/cleanup", cleanupRoutes);

const authRoutes = require("./routes/auth");

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});