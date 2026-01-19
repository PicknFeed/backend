const matchingModel = require('../models/matchingModel');

exports.createRequest = async (req, res) => {
  const userId = req.user.id;
  const companyId = Number(req.body?.companyId);
  if (!companyId) return res.status(400).json({ message: 'companyId required' });

  const id = await matchingModel.createRequest(userId, companyId);
  res.status(201).json({ id, status: 'PENDING' });
};

exports.listMyRequests = async (req, res) => {
  const userId = req.user.id;
  const rows = await matchingModel.listByUser(userId);
  res.json(rows);
};

// 발표용: role=admin 이거나, 일단 "company 화면"을 위해 모두 열어도 됨.
// 여기선 안전하게 admin만 허용.
exports.listCompanyRequests = async (req, res) => {
  if (req.user?.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });

  const rows = await matchingModel.listForCompany();
  res.json(rows);
};

exports.updateRequestStatus = async (req, res) => {
  if (req.user?.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });

  const id = Number(req.params.id);
  const status = (req.body?.status ?? '').toString();

  if (!id) return res.status(400).json({ message: 'id required' });
  if (!['APPROVED', 'REJECTED'].includes(status)) {
    return res.status(400).json({ message: 'status must be APPROVED or REJECTED' });
  }

  await matchingModel.updateStatus(id, status);
  res.json({ ok: true });
};