const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const appointmentRoutes = require("./routes/appointment.routes");

const app = express();

// Enable CORS for all routes
app.use(cors());
// Parse JSON bodies
app.use(express.json());
// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Mount appointment routes
app.use("/api/appointments", appointmentRoutes);

module.exports = app;
