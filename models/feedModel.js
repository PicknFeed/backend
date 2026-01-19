const pool = require('../config/db');

exports.listByUserId = async (userId) => {
  const [rows] = await pool.execute(
    `SELECT id, company_name, score, picked, checklist_json, comment, created_at
     FROM feeds WHERE user_id=? ORDER BY id DESC`,
    [userId]
  );
  return rows;
};

exports.create = async ({ userId, companyName, score, picked, checklist, comment }) => {
  await pool.execute(
    `INSERT INTO feeds(user_id, company_name, score, picked, checklist_json, comment)
     VALUES(?, ?, ?, ?, ?, ?)`,
    [userId, companyName, score, picked ? 1 : 0, JSON.stringify(checklist || {}), comment || '']
  );
};