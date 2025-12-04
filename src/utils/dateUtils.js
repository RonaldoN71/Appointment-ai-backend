const moment = require("moment-timezone");

// Map weekday names to moment.js day numbers
const WEEKDAYS = {
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
  sunday: 0
};

function parseDatePhrase(phrase, tz = "Asia/Kolkata") {
  if (!phrase) return null;

  const lower = phrase.toLowerCase().trim();
  let date = moment().tz(tz);

  if (lower === "today") {
    // Already set to today
  } else if (lower === "tomorrow") {
    date = date.add(1, "day");
  } else if (lower === "day after tomorrow") {
    date = date.add(2, "days");
  } else if (lower.startsWith("next ")) {
    // Handle "next monday", "next friday", etc.
    const weekday = lower.replace("next ", "").trim();
    const targetDow = WEEKDAYS[weekday];

    if (typeof targetDow === "number") {
      // Jump to next week, then set the target day
      date = date.add(1, "week").day(targetDow);
    } else {
      return null;
    }
  } else {
    // Try to parse explicit date formats
    const m = moment.tz(lower, ["D/M/YYYY", "D-M-YYYY", "D/M/YY", "D-M-YY"], tz);
    if (m.isValid()) {
      date = m;
    } else {
      return null;
    }
  }

  return date.format("YYYY-MM-DD");
}

function parseTimePhrase(phrase, tz = "Asia/Kolkata") {
  if (!phrase) return null;

  const lower = phrase.toLowerCase().trim();

  // Support formats like "3pm", "10:30 am", "15:00"
  const formats = ["h:mm a", "h a", "H:mm"];

  const timeMoment = moment.tz(lower, formats, tz);
  if (!timeMoment.isValid()) {
    return null;
  }

  // Return in 24-hour format
  return timeMoment.format("HH:mm");
}

module.exports = {
  parseDatePhrase,
  parseTimePhrase
};
