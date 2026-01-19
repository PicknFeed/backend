const pool = require('../config/db');

exports.list = async () => {
  const [rows] = await pool.execute(
    `SELECT id, name, position, skills_json FROM people ORDER BY id DESC`
  );

  return rows.map(r => ({
    id: r.id,
    name: r.name,
    position: r.position,
    skills: r.skills_json ? JSON.parse(r.skills_json) : []
  }));
};