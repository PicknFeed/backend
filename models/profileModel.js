const pool = require('../config/db');

exports.getByUserId = async (userId) => {
  const [rows] = await pool.execute('SELECT * FROM profiles WHERE user_id=?', [userId]);
  return rows[0];
};

exports.upsert = async (userId, resumeText) => {
  await pool.execute(
    `INSERT INTO profiles(user_id, resume_text)
     VALUES(?, ?)
     ON DUPLICATE KEY UPDATE resume_text=VALUES(resume_text)`,
    [userId, resumeText]
  );
};