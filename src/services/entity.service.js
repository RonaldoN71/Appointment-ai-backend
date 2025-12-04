// Map keywords to normalized department names
const DEPARTMENT_KEYWORDS = [
  { keyword: "dentist", department: "Dentistry" },
  { keyword: "dental", department: "Dentistry" },
  { keyword: "cardio", department: "Cardiology" },
  { keyword: "cardiologist", department: "Cardiology" },
  { keyword: "ortho", department: "Orthopaedics" },
  { keyword: "orthopaedic", department: "Orthopaedics" },
  { keyword: "skin", department: "Dermatology" },
  { keyword: "derma", department: "Dermatology" }
];

exports.extractEntities = (text) => {
  const lower = text.toLowerCase();

  // Find department by matching keywords
  let department = null;
  let department_normalized = null;

  for (const item of DEPARTMENT_KEYWORDS) {
    if (lower.includes(item.keyword)) {
      department = item.keyword;
      department_normalized = item.department;
      break;
    }
  }

  // Extract time phrases like "3pm", "10:30 am", "15:00"
  const timeRegex = /\b(\d{1,2}(:\d{2})?\s?(am|pm))\b|\b(\d{1,2}:\d{2})\b/;
  const timeMatch = lower.match(timeRegex);
  const time_phrase = timeMatch ? timeMatch[0] : null;

  // Extract date phrases - supports relative dates and explicit dates
  let date_phrase = null;

  // Check for relative dates first (order matters)
  if (lower.includes("day after tomorrow")) {
    date_phrase = "day after tomorrow";
  } else if (lower.includes("tomorrow")) {
    date_phrase = "tomorrow";
  } else if (lower.includes("today")) {
    date_phrase = "today";
  } else {
    // Check for "next <weekday>"
    const weekdays = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday"
    ];

    for (const day of weekdays) {
      if (lower.includes("next " + day)) {
        date_phrase = "next " + day;
        break;
      }
    }

    // Fallback to explicit date format like 26/01/2025 or 26-01-2025
    if (!date_phrase) {
      const dateRegex = /\b(\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4})\b/;
      const dateMatch = lower.match(dateRegex);
      if (dateMatch) {
        date_phrase = dateMatch[0];
      }
    }
  }

  return {
    appointment_type: department_normalized ? department_normalized : department,
    department,
    department_normalized,
    date_phrase,
    time_phrase,
    raw: text
  };
};
