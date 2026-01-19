// controllers/dataController.js
const pool = require('../config/db');

// 회사 목록 조회 (프론트 Company 모델: id,name,position,skills[])
exports.getCompanies = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT id, name, position, skills_json
       FROM companies
       ORDER BY id DESC`
    );

    const result = rows.map(r => ({
      id: r.id,
      name: r.name,
      position: r.position || '',
      skills: r.skills_json ? JSON.parse(r.skills_json) : [],
    }));

    res.json(result);
  } catch (e) {
    console.error(e);
    res.status(500).json([]);
  }
};

// 개인(구직자) 목록 조회 (프론트 Person 모델: name,position,skills[])
exports.getPeople = async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT u.name,
             COALESCE(p.position, '신입') AS position,
             p.skills
      FROM users u
      LEFT JOIN profiles p ON u.id = p.user_id
      WHERE u.role = 'PERSONAL'
      ORDER BY u.id DESC
    `);

    const result = rows.map(r => ({
      name: r.name,
      position: r.position || '신입',
      skills: (r.skills ?? '')
        .split(',')
        .map(s => s.trim())
        .filter(Boolean),
    }));

    res.json(result);
  } catch (e) {
    console.error(e);
    res.status(500).json([]);
  }
};
