const app = require("../app");
const dotenv = require("dotenv");

dotenv.config();

// Default to port 3000 if not specified in env
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
