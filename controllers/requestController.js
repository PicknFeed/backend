// controllers/requestController.js
const pool = require('../config/db');

// [개인] 내가 보낸 요청 목록
exports.getMyRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    const [rows] = await pool.execute(`
      SELECT r.id,
             r.status,
             c.name as company_name
      FROM matching_requests r
      JOIN companies c ON r.company_id = c.id
      WHERE r.user_id = ?
      ORDER BY r.id DESC
    `, [userId]);

    const result = rows.map(row => ({
      id: row.id,
      companyName: row.company_name,
      status: row.status,
    }));

    res.json(result);
  } catch (e) {
    console.error(e);
    res.status(500).json([]);
  }
};

// [개인] 회사에 매칭 요청 보내기
exports.createRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const companyId = Number(req.body?.companyId);

    if (!companyId) return res.status(400).json({ ok: false, message: 'companyId required' });

    await pool.execute(
      'INSERT INTO matching_requests (user_id, company_id, status) VALUES (?, ?, ?)',
      [userId, companyId, 'PENDING']
    );
    res.status(201).json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false });
  }
};

// [기업] 나에게 온 요청 목록 (데모: 전체 요청)
exports.getCompanyRequests = async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT r.id AS requestId,
             u.name AS personName,
             c.name AS companyName,
             COALESCE(c.position, '') AS position,
             p.skills AS personSkills,
             r.status AS status
      FROM matching_requests r
      JOIN users u ON r.user_id = u.id
      LEFT JOIN profiles p ON u.id = p.user_id
      JOIN companies c ON r.company_id = c.id
      ORDER BY r.id DESC
    `);

    const result = rows.map(row => ({
      requestId: row.requestId,
      personName: row.personName ?? '',
      companyName: row.companyName ?? '',
      position: row.position ?? '',
      skills: (row.personSkills ?? '')
        .split(',')
        .map(s => s.trim())
        .filter(Boolean),
      status: row.status ?? 'PENDING',
    }));

    res.json(result);
  } catch (e) {
    console.error(e);
    res.status(500).json([]);
  }
};

// [기업] 요청 수락/거절
exports.updateRequestStatus = async (req, res) => {
  try {
    const role = req.user?.role;
    if (!['COMPANY', 'ADMIN'].includes(role)) {
      return res.status(403).json({ ok: false, message: 'Forbidden' });
    }

    const id = Number(req.params.id);
    const status = (req.body?.status ?? '').toString();

    if (!id) return res.status(400).json({ ok: false, message: 'id required' });
    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ ok: false, message: 'status must be APPROVED or REJECTED' });
    }

    await pool.execute('UPDATE matching_requests SET status=? WHERE id=?', [status, id]);
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false });
  }
};
