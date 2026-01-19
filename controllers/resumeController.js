const path = require('path');
const fs = require('fs');
const multer = require('multer');
const resumeModel = require('../models/resumeModel');

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const safeExt = path.extname(file.originalname) || '';
    const stored = `${Date.now()}_${Math.random().toString(16).slice(2)}${safeExt}`;
    cb(null, stored);
  },
});

// PDF만 강제하고 싶으면 아래처럼. (발표용이면 pdf만 추천)
function fileFilter(req, file, cb) {
  // 허용: pdf
  const ok = file.mimetype === 'application/pdf';
  if (!ok) return cb(new Error('Only PDF files are allowed'), false);
  cb(null, true);
}

const uploader = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

exports.upload = (req, res) => {
  uploader.single('file')(req, res, async (err) => {
    try {
      if (err) {
        return res.status(400).json({ ok: false, message: err.message });
      }
      if (!req.file) {
        return res.status(400).json({ ok: false, message: 'file is required' });
      }

      const userId = req.user.id;
      const url = `/uploads/${req.file.filename}`;

      const id = await resumeModel.create({
        userId,
        originalName: req.file.originalname,
        storedName: req.file.filename,
        mime: req.file.mimetype,
        size: req.file.size,
        url,
      });

      return res.status(201).json({ ok: true, id, url });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ ok: false, message: 'server error' });
    }
  });
};

exports.listMine = async (req, res) => {
  try {
    const userId = req.user.id;
    const rows = await resumeModel.listByUserId(userId);
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json([]);
  }
};