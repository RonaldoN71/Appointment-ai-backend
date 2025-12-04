// Check if all required entities were extracted from the text
function validateEntities(entities) {
  const missing = [];

  if (!entities.department && !entities.department_normalized) {
    missing.push("department");
  }
  if (!entities.date_phrase) {
    missing.push("date");
  }
  if (!entities.time_phrase) {
    missing.push("time");
  }

  if (missing.length > 0) {
    return {
      ok: false,
      missing,
      message: `Missing or unclear fields: ${missing.join(", ")}`
    };
  }

  return { ok: true, missing: [], message: "ok" };
}

// Verify that normalization successfully converted phrases to dates/times
function validateNormalization(normalized) {
  const missing = [];

  if (!normalized.date) {
    missing.push("date");
  }
  if (!normalized.time) {
    missing.push("time");
  }

  if (missing.length > 0) {
    return {
      ok: false,
      missing,
      message: `Could not normalize: ${missing.join(", ")}`
    };
  }

  return { ok: true, missing: [], message: "ok" };
}

module.exports = {
  validateEntities,
  validateNormalization
};
