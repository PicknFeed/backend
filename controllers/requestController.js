const pool = require('../config/db');

// [개인] 내가 보낸 요청 목록
exports.getMyRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    const [rows] = await pool.execute(`
      SELECT r.id, r.status, c.name as company_name, r.created_at
      FROM matching_requests r
      JOIN companies c ON r.company_id = c.id
      WHERE r.user_id = ?
      ORDER BY r.id DESC
    `, [userId]);
    
    // Frontend Model(RequestItem) 매핑: { id, companyName, status, date }
    const result = rows.map(row => ({
      id: row.id,
      companyName: row.company_name,
      status: row.status,
      date: row.created_at
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
    const { companyId } = req.body;
    
    await pool.execute(
      'INSERT INTO matching_requests (user_id, company_id, status) VALUES (?, ?, ?)',
      [userId, companyId, 'PENDING']
    );
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false });
  }
};

// [기업] 나에게 온 요청 목록
exports.getCompanyRequests = async (req, res) => {
  try {
    // 실제로는 기업 관리자가 관리하는 company_id를 알아야 하지만,
    // 데모에서는 모든 요청을 보여주거나, 특정 company_id를 가정합니다.
    // 여기서는 간단히 '모든' 요청을 가져오되, 유저 정보를 포함합니다.
    
    // 만약 기업회원 <-> company 테이블 매핑이 있다면 WHERE r.company_id = ? 추가 필요.
    // 현재는 간단 데모이므로 전체 조회.
    const [rows] = await pool.execute(`
      SELECT r.id, r.status, u.name as user_name, p.skills, r.created_at
      FROM matching_requests r
      JOIN users u ON r.user_id = u.id
      LEFT JOIN profiles p ON u.id = p.user_id
      ORDER BY r.id DESC
    `);

    // Frontend Model(Matching) 매핑
    const result = rows.map(row => ({
      id: row.id,
      userName: row.user_name,
      targetPosition: row.skills || '신입', // 직무 정보가 없으면 스킬로 대체
      status: row.status,
      date: row.created_at
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
    const { id } = req.params;
    const { status } = req.body; // 'APPROVED' or 'REJECTED'
    
    await pool.execute(
      'UPDATE matching_requests SET status = ? WHERE id = ?',
      [status, id]
    );
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false });
  }
};
