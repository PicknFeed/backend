const evaluationModel = require('../models/evaluationModel');

exports.create = async (req, res) => {
  const requestId = Number(req.body?.requestId);
  const score = Number(req.body?.score);
  const comment = (req.body?.comment ?? '').toString();

  if (!requestId) return res.status(400).json({ message: 'requestId required' });
  if (!score || score < 1 || score > 5) return res.status(400).json({ message: 'score must be 1~5' });

  const id = await evaluationModel.create({ requestId, score, comment });
  res.status(201).json({ id, ok: true });
};

exports.listMine = async (req, res) => {
  // 개인: 내가 만든 요청에 달린 평가 조회
  const userId = req.user.id;
  const rows = await evaluationModel.listByUserId(userId);
  res.json(rows);
};