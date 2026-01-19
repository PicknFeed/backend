const pool = require('../config/db');

exports.create = async ({ userId, originalName, storedName, mime, size, url }) => {
  const [r] = await pool.execute(
    `INSERT INTO resume_files(user_id, original_name, stored_name, mime, size, url)
     VALUES(?, ?, ?, ?, ?, ?)`,
    [userId, originalName, storedName, mime || null, size || null, url]
  );
  return r.insertId;
};

exports.listByUserId = async (userId) => {
  const [rows] = await pool.execute(
    `SELECT id, original_name, mime, size, url, created_at
     FROM resume_files
     WHERE user_id=?
     ORDER BY id DESC`,
    [userId]
  );
  return rows.map(r => ({
    id: r.id,
    originalName: r.original_name,
    mime: r.mime,
    size: r.size,
    url: r.url,
    createdAt: r.created_at
  }));
};