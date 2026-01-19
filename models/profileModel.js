// models/profileModel.js
const pool = require('../config/db');

exports.getByUserId = async (userId) => {
  const [rows] = await pool.execute('SELECT * FROM profiles WHERE user_id=?', [userId]);
  return rows[0];
};

// resume_text, position, skills 업서트
exports.upsert = async (userId, { resume_text, position, skills }) => {
  await pool.execute(
    `INSERT INTO profiles(user_id, resume_text, position, skills)
     VALUES(?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       resume_text = VALUES(resume_text),
       position    = VALUES(position),
       skills      = VALUES(skills)`,
    [
      userId,
      resume_text ?? '',
      position ?? null,
      skills ?? null,
    ]
  );
};
