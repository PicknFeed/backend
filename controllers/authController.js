const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

exports.register = async (req, res) => {
  try {
    const { email, password, name, role } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ message: '모든 필드를 입력해주세요' });
    }

    const existingUser = await userModel.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: '이미 존재하는 이메일입니다' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const validRole = (role === 'company' || role === 'COMPANY') ? 'COMPANY' : 'PERSONAL';

    const userId = await userModel.create({
      email,
      password: hashedPassword,
      name,
      role: validRole
    });

    res.status(201).json({ message: '회원가입 성공', userId });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: '서버 오류' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ message: '이메일과 비밀번호를 입력해주세요' });

    // DB 조회
    const user = await userModel.findByEmail(email);
    
    // DB에 없으면 데모 계정 체크 (DB 초기화 전 비상용)
    if (!user) {
       if (email === 'admin@test.com' && password === '1234') {
         // ... (기존 데모 로직 유지 혹은 제거)
         // 여기서는 DB가 우선이므로 실패 처리하되, 
         // 혹시 모를 상황 위해 남겨둘 수도 있지만, 깔끔하게 DB 기반으로 갑니다.
         return res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다' });
       }
       return res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다' });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다' });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: '로그인 성공',
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role }
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};