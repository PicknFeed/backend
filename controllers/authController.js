const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ message: '이메일과 비밀번호를 입력해주세요' });

    // ✅ 데모 admin 계정(하루용)
    if (email === 'admin@test.com' && password === '1234') {
      const token = jwt.sign(
        { id: 999, email, username: 'admin', role: 'admin' },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
      return res.json({ message: '로그인 성공', token, user: { id: 999, email, username: 'admin', name: 'Admin', role: 'admin' } });
    }

    const user = await userModel.findByEmail(email);
    if (!user) return res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다' });

    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username, role: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: '로그인 성공',
      token,
      user: { id: user.id, email: user.email, name: user.name, username: user.username, role: 'user' }
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};