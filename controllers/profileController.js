// controllers/profileController.js
const profileModel = require('../models/profileModel');

exports.me = async (req, res) => {
  const userId = req.user.id;
  const profile = await profileModel.getByUserId(userId);
  res.json({ user: req.user, profile: profile || { user_id: userId, resume_text: '' } });
};

// PUT /api/users/me/profile (기존 유지)
// + POST /api/profile (프론트 saveProfile 호환으로 같이 사용)
exports.update = async (req, res) => {
  const userId = req.user.id;

  const resume_text = (req.body?.resume_text ?? req.body?.resumeText ?? '').toString();
  const position = req.body?.position != null ? req.body.position.toString() : null;

  // skills: 리스트로 오면 "a, b"로 저장 / 문자열이면 그대로 저장
  let skills = null;
  if (req.body?.skills != null) {
    if (Array.isArray(req.body.skills)) {
      skills = req.body.skills.map(s => String(s).trim()).filter(Boolean).join(', ');
    } else {
      skills = String(req.body.skills);
    }
  }

  await profileModel.upsert(userId, { resume_text, position, skills });
  res.json({ ok: true });
};
