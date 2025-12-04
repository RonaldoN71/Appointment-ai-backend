# Appointment AI Backend

A Node.js backend service that extracts appointment information from text or images using OCR. The service parses appointment details including date, time, and department from both plain text input and uploaded images.

**Backend URL:** `https://your-backend-url.com`

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory and add:
```env
PORT=3000
TZ=Asia/Kolkata
```

**Note:** `TZ` is optional. If not provided, it defaults to `Asia/Kolkata`.

3. Run the server:
```bash
npm run dev
```

The server will start on `http://localhost:3000`

## API Usage

### POST `/api/appointments/parse`

Parse appointment information from text or an uploaded image.

**Request:**
- Content-Type: `multipart/form-data`
- Body:
  - `text` (optional): Plain text containing appointment information
  - `image` (optional): Image file containing appointment text

**Note**: Either `text` or `image` must be provided.

**Example with text:**
```bash
curl -X POST https://your-backend-url.com/api/appointments/parse \
  -F "text=Appointment with dentist tomorrow at 3pm"
```

**Example with image:**
```bash
curl -X POST https://your-backend-url.com/api/appointments/parse \
  -F "image=@/path/to/appointment-image.jpg"
```

**Success Response:**
```json
{
  "step1_ocr": {
    "raw_text": "Appointment with dentist tomorrow at 3pm",
    "confidence": 0.95
  },
  "step2_entities": {
    "entities": {
      "date_phrase": "tomorrow",
      "time_phrase": "3pm",
      "department": "dentist"
    },
    "entities_confidence": 0.85
  },
  "step3_normalized": {
    "normalized": {
      "date": "2025-01-27",
      "time": "15:00",
      "tz": "Asia/Kolkata"
    },
    "normalization_confidence": 0.90
  },
  "final": {
    "appointment": {
      "department": "Dentistry",
      "date": "2025-01-27",
      "time": "15:00",
      "tz": "Asia/Kolkata"
    },
    "status": "ok"
  }
}
```

## Supported Formats

**Date Formats:**
- `today`, `tomorrow`, `day after tomorrow`
- `next monday`, `next friday`, etc.
- `26/01/2025`, `26-01-2025`

**Time Formats:**
- `3pm`, `10:30 am`, `11:00 PM`
- `15:00`, `14:30`

**Departments:**
- `dentist`, `dental` → Dentistry
- `cardio`, `cardiologist` → Cardiology
- `ortho`, `orthopaedic` → Orthopaedics
- `skin`, `derma` → Dermatology

