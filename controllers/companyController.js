const companyModel = require('../models/companyModel');

exports.list = async (req, res) => {
  const rows = await companyModel.list();
  res.json(rows);
};