const feedModel = require('../models/feedModel');

exports.myFeeds = async (req, res) => {
  const userId = req.user.id;
  const rows = await feedModel.listByUserId(userId);
  res.json(rows);
};