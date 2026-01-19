const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const feedModel = require('../models/feedModel');

function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  next();
}

router.get('/users', auth, requireAdmin, async (req, res) => {
  // 발표용 더미
  res.json([
    { id: 1, name: '이다하', email: 'user@test.com' },
    { id: 2, name: '김지원', email: 'jwon@test.com' }
  ]);
});

router.post('/feeds', auth, requireAdmin, async (req, res) => {
  const b = req.body || {};
  const userId = Number(b.user_id);
  if (!userId) return res.status(400).json({ message: 'user_id required' });

  await feedModel.create({
    userId,
    companyName: (b.company_name ?? 'PicknFeed').toString(),
    score: Number(b.score ?? 80),
    picked: !!b.picked,
    checklist: b.checklist ?? {},
    comment: (b.comment ?? '').toString()
  });

  res.json({ ok: true });
});

module.exports = router;