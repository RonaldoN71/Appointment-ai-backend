const express = require("express");
const multer = require("multer");

const appointmentController = require("../controllers/appointment.controller");

const router = express.Router();

// Store uploaded files in memory instead of disk
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Parse appointment from text or image
router.post(
  "/parse",
  upload.single("image"),
  appointmentController.parseAppointment
);

module.exports = router;
