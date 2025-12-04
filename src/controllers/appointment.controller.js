const ocrService = require("../services/ocr.service");
const entityService = require("../services/entity.service");
const normalizeService = require("../services/normalize.service");
const { validateEntities, validateNormalization } = require("../utils/guardrail");

exports.parseAppointment = async (req, res) => {
  try {
    const inputText = req.body.text || null;
    const imageFile = req.file || null;

    // Extract text from image or use provided text
    const step1 = await ocrService.extractText({
      text: inputText,
      fileBuffer: imageFile ? imageFile.buffer : null
    });

    const raw_text = step1.raw_text;
    const confidence = step1.confidence;

    // Can't proceed without any text
    if (!raw_text || raw_text.trim().length === 0) {
      return res.status(200).json({
        status: "needs_clarification",
        message: "Unable to extract text from input.",
        step1_ocr: step1
      });
    }

    // Extract date, time, and department from the text
    const extracted = entityService.extractEntities(raw_text);

    const step2 = {
      entities: {
        date_phrase: extracted.date_phrase,
        time_phrase: extracted.time_phrase,
        department: extracted.department
      },
      entities_confidence: 0.85
    };

    // Check if we have all required entities
    const entityCheck = validateEntities(extracted);
    if (!entityCheck.ok) {
      return res.status(200).json({
        status: "needs_clarification",
        message: "Ambiguous date/time or department",
        step1_ocr: step1,
        step2_entities: step2
      });
    }

    // Convert date/time phrases to standardized format
    const normalized = normalizeService.normalizeEntities(extracted);

    const step3 = {
      normalized: normalized,
      normalization_confidence: 0.90
    };

    // Make sure normalization actually worked
    const normCheck = validateNormalization(normalized);
    if (!normCheck.ok) {
      return res.status(200).json({
        status: "needs_clarification",
        message: "Ambiguous date/time or department",
        step1_ocr: step1,
        step2_entities: step2,
        step3_normalized: step3
      });
    }

    // Build final appointment object
    const final = {
      appointment: {
        department: extracted.department_normalized || extracted.department,
        date: normalized.date,
        time: normalized.time,
        tz: normalized.tz
      },
      status: "ok"
    };

    // Return all steps for debugging/transparency
    return res.status(200).json({
      step1_ocr: step1,
      step2_entities: step2,
      step3_normalized: step3,
      final: final
    });

  } catch (err) {
    console.error("Controller Error:", err);
    return res.status(500).json({
      status: "error",
      message: "Internal server error"
    });
  }
};
