const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const feedRoutes = require('./routes/feeds');
// const adminRoutes = require('./routes/admin'); // 잠시 비활성화 or 유지

// New Controllers
const dataController = require('./controllers/dataController');
const requestController = require('./controllers/requestController');
const authMiddleware = require('./middleware/auth');
const profileController = require('./controllers/profileController');

const evaluationRoutes = require('./routes/evaluation');
const resumeRoutes = require('./routes/resumes')

const app = express();
app.use(cors());
app.use(express.json());

// 정적 파일 서빙 (이력서 업로드 파일 접근)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Logging
app.use((req, res, next) => {
  console.log(`[REQ] ${req.method} ${req.originalUrl}`);
  next();
});

app.get('/api/ping', (req, res) => res.json({ ok: true }));

// Auth & Users
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Old Feed routes (유지)
app.use('/api/feeds', feedRoutes);

// === New Minix Routes ===
// 1. Data (Public or Protected)
app.get('/api/companies', authMiddleware, dataController.getCompanies);
app.get('/api/people', authMiddleware, dataController.getPeople);

// 2. Personal Requests
app.get('/api/personal/requests', authMiddleware, requestController.getMyRequests);
app.post('/api/personal/requests', authMiddleware, requestController.createRequest);

// 3. Company Requests
app.get('/api/company/requests', authMiddleware, requestController.getCompanyRequests);
app.patch('/api/company/requests/:id', authMiddleware, requestController.updateRequestStatus);

// profile 호환 (프론트 saveProfile용)
app.post('/api/profile', authMiddleware, profileController.update);

// evaluation 진짜 구현
app.use('/api/evaluation', evaluationRoutes);

// 이력서 업로드 라우트
app.use('/api/resumes', resumeRoutes);

module.exports = app;