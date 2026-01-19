const profileModel = require('../models/profileModel');

exports.me = async (req, res) => {
  const userId = req.user.id;
  const profile = await profileModel.getByUserId(userId);
  res.json({ user: req.user, profile: profile || { user_id: userId, resume_text: '' } });
};

exports.update = async (req, res) => {
  const userId = req.user.id;
  const resumeText = (req.body?.resume_text ?? '').toString();
  await profileModel.upsert(userId, resumeText);
  res.json({ ok: true });
};