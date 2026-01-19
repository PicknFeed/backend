const pool = require('../config/db');

exports.create = async ({ requestId, score, comment }) => {
  const [r] = await pool.execute(
    `INSERT INTO evaluations(request_id, score, comment) VALUES(?, ?, ?)`,
    [requestId, score, comment || '']
  );
  return r.insertId;
};

exports.listByUserId = async (userId) => {
  const [rows] = await pool.execute(
    `SELECT e.id, e.evaluator, e.target, e.score, e.comment, e.created_at
     FROM evaluations e
     JOIN match_requests mr ON mr.id = e.request_id
     WHERE mr.user_id=?
     ORDER BY e.id DESC`,
    [userId]
  );

  return rows.map(r => ({
    id: r.id,
    evaluator: r.evaluator,
    target: r.target,
    score: r.score,
    comment: r.comment,
    created_at: r.created_at
  }));
};