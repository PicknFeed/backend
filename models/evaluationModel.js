// models/evaluationModel.js
const pool = require('../config/db');

exports.create = async ({ requestId, evaluatorId, score, comment }) => {
  const [r] = await pool.execute(
    `INSERT INTO evaluations(request_id, evaluator_id, score, comment)
     VALUES(?, ?, ?, ?)`,
    [requestId, evaluatorId, score, comment || '']
  );
  return r.insertId;
};

// 개인: 내가 보낸 요청들에 달린 평가 조회
exports.listForPersonal = async (userId) => {
  const [rows] = await pool.execute(
    `SELECT e.id,
            ev.name AS evaluator,
            tg.name AS target,
            e.score,
            e.comment,
            e.created_at
     FROM evaluations e
     JOIN matching_requests r ON r.id = e.request_id
     JOIN users ev ON ev.id = e.evaluator_id
     JOIN users tg ON tg.id = r.user_id
     WHERE r.user_id = ?
     ORDER BY e.id DESC`,
    [userId]
  );

  return rows;
};
