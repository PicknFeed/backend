const pool = require('../config/db');

// 회사 목록 조회
exports.getCompanies = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM companies ORDER BY id DESC');
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json([]);
  }
};

// 개인(구직자) 목록 조회 (기업 유저용)
exports.getPeople = async (req, res) => {
  try {
    // PERSONAL 권한을 가진 유저와 프로필 조인
    const [rows] = await pool.execute(`
      SELECT u.id, u.name, u.email, p.resume_text, p.skills 
      FROM users u
      LEFT JOIN profiles p ON u.id = p.user_id
      WHERE u.role = 'PERSONAL'
      ORDER BY u.id DESC
    `);
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json([]);
  }
};