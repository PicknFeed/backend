// controllers/evaluationController.js
const evaluationModel = require('../models/evaluationModel');
const pool = require('../config/db');

exports.create = async (req, res) => {
  try {
    const role = req.user?.role;
    if (!['COMPANY', 'ADMIN'].includes(role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const requestId = Number(req.body?.requestId);
    const score = Number(req.body?.score);
    const comment = (req.body?.comment ?? '').toString();

    if (!requestId) return res.status(400).json({ message: 'requestId required' });
    if (!score || score < 1 || score > 5) {
      return res.status(400).json({ message: 'score must be 1~5' });
    }

    // 요청 존재 확인(데모 안전)
    const [chk] = await pool.execute(
      'SELECT id FROM matching_requests WHERE id=?',
      [requestId]
    );
    if (!chk[0]) return res.status(404).json({ message: 'request not found' });

    const id = await evaluationModel.create({
      requestId,
      evaluatorId: req.user.id,
      score,
      comment,
    });

    res.status(201).json({ id, ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'server error' });
  }
};

exports.listMine = async (req, res) => {
  try {
    const role = req.user?.role;

    // 개인: 내가 받은 평가들
    if (role === 'PERSONAL') {
      const rows = await evaluationModel.listForPersonal(req.user.id);
      return res.json(rows);
    }

    // 기업/관리자: (필요하면 확장) 일단 빈 배열
    return res.json([]);
  } catch (e) {
    console.error(e);
    res.status(500).json([]);
  }
};
