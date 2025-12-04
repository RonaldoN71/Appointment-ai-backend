const Tesseract = require("tesseract.js");

exports.extractText = async ({ text, fileBuffer }) => {
  // If text was provided directly, no need to run OCR
  if (text && text.trim().length > 0) {
    return {
      raw_text: text.trim(),
      confidence: 0.95
    };
  }

  // No file to process
  if (!fileBuffer) {
    return {
      raw_text: "",
      confidence: 0.0
    };
  }

  // Run OCR on the image
  try {
    const result = await Tesseract.recognize(fileBuffer, "eng");
    const raw_text = result.data.text || "";
    const confidence = result.data.confidence || 0.0;

    return { raw_text, confidence };
  } catch (err) {
    console.error("OCR error:", err);
    return {
      raw_text: "",
      confidence: 0.0
    };
  }
};
