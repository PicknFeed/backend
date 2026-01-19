const peopleModel = require('../models/peopleModel');

exports.list = async (req, res) => {
  const rows = await peopleModel.list();
  res.json(rows);
};