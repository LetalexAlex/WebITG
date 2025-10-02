import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
// @ts-ignore
import {saveSM} from "./songdb.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Example API
app.get("/api/hello", (_req, res) => {
  res.json({ message: "Hello from backend!" });
});

const upload = multer({ dest: "uploads/" })
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  console.log("Uploaded file:", req.file);
  const out = saveSM(req.file);
  res.send(JSON.stringify(out));
});

// Serve frontend build
app.use(express.static(path.join(__dirname, "../frontend")));

app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
