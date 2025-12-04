const express = require("express");
const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  res.json({ message: "Success connect to" });
});

app.listen(PORT, () => {
  console.log(`running on http://localhost:${PORT}`);
});
