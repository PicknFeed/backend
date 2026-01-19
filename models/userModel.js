const pool = require('../config/db');

exports.findByEmail = async (email) => {
  const [rows] = await pool.execute('SELECT * FROM users WHERE email=?', [email]);
  return rows[0];
};

exports.create = async ({ email, password, name, role }) => {
  const [result] = await pool.execute(
    'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)',
    [email, password, name, role]
  );
  return result.insertId;
};

exports.findById = async (id) => {
  const [rows] = await pool.execute('SELECT id, email, name, role FROM users WHERE id=?', [id]);
  return rows[0];
};