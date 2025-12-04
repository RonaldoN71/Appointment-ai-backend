const { parseDatePhrase, parseTimePhrase } = require("../utils/dateUtils");

const DEFAULT_TZ = "Asia/Kolkata";

exports.normalizeEntities = (entities) => {
  const tz = DEFAULT_TZ;

  // Convert date/time phrases to ISO format
  const date = parseDatePhrase(entities.date_phrase, tz);
  const time = parseTimePhrase(entities.time_phrase, tz);

  return {
    date, // "YYYY-MM-DD" or null
    time, // "HH:mm" or null
    tz
  };
};
