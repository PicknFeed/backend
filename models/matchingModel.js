const pool = require('../config/db');

exports.createRequest = async (userId, companyId) => {
  const [r] = await pool.execute(
    `INSERT INTO match_requests(user_id, company_id) VALUES(?, ?)`,
    [userId, companyId]
  );
  return r.insertId;
};

exports.listByUser = async (userId) => {
  const [rows] = await pool.execute(
    `SELECT mr.id, c.name AS companyName, mr.status
     FROM match_requests mr
     JOIN companies c ON c.id = mr.company_id
     WHERE mr.user_id=?
     ORDER BY mr.id DESC`,
    [userId]
  );

  return rows.map(r => ({
    id: r.id,
    companyName: r.companyName,
    status: r.status
  }));
};

exports.listForCompany = async () => {
  const [rows] = await pool.execute(
    `SELECT mr.id AS requestId,
            p.name AS personName,
            c.name AS companyName,
            c.position AS position,
            c.skills_json AS skills_json,
            mr.status AS status
     FROM match_requests mr
     JOIN users u ON u.id = mr.user_id
     JOIN people p ON p.name = u.name
     JOIN companies c ON c.id = mr.company_id
     ORDER BY mr.id DESC`
  );

  return rows.map(r => ({
    requestId: r.requestId,
    personName: r.personName,
    companyName: r.companyName,
    position: r.position,
    skills: r.skills_json ? JSON.parse(r.skills_json) : [],
    status: r.status
  }));
};

exports.updateStatus = async (requestId, status) => {
  await pool.execute(
    `UPDATE match_requests SET status=? WHERE id=?`,
    [status, requestId]
  );
};