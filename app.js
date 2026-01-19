const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const feedRoutes = require('./routes/feeds');
const adminRoutes = require('./routes/admin');
const companyRoutes = require('./routes/companies');
const peopleRoutes = require('./routes/people');
const personalMatchingRoutes = require('./routes/matching_personal');
const companyMatchingRoutes = require('./routes/matching_company');
const evaluationRoutes = require('./routes/evaluation');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/ping', (req, res) => res.json({ ok: true }));

app.use((req, res, next) => {
  console.log(`[REQ] ${req.method} ${req.originalUrl}`);
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/feeds', feedRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/people', peopleRoutes);
app.use('/api/personal', personalMatchingRoutes);
app.use('/api/company', companyMatchingRoutes);
app.use('/api/evaluation', evaluationRoutes);

module.exports = app;