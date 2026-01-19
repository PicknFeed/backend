feedsfeedsprofilesprofilesusersusers-- Pick&Feed 데이터베이스 초기화 스크립트
-- 사용법: MySQL Workbench에서 열어서 전체 실행(⚡)

-- DB 생성
CREATE DATABASE IF NOT EXISTS picknfeed
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE picknfeed;

-- users (로그인)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  username VARCHAR(50) NOT NULL UNIQUE,
  role ENUM('user','admin') NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- profiles (이력서)
CREATE TABLE IF NOT EXISTS profiles (
  user_id INT PRIMARY KEY,
  resume_text TEXT NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

-- feeds (Pick & Feed 결과)
CREATE TABLE IF NOT EXISTS feeds (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  company_name VARCHAR(100) NOT NULL,
  score INT NOT NULL,
  picked TINYINT(1) NOT NULL DEFAULT 0,
  checklist_json JSON NULL,
  comment TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id),
  FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

-- companies (기업 목록)
CREATE TABLE IF NOT EXISTS companies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  position VARCHAR(100) NOT NULL,
  skills_json JSON NULL
) ENGINE=InnoDB;

-- people (개인 목록)
CREATE TABLE IF NOT EXISTS people (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  position VARCHAR(100) NOT NULL,
  skills_json JSON NULL
) ENGINE=InnoDB;

-- match_requests (매칭 요청)
CREATE TABLE IF NOT EXISTS match_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,          -- 개인(로그인 유저)
  company_id INT NOT NULL,
  status ENUM('PENDING','APPROVED','REJECTED') NOT NULL DEFAULT 'PENDING',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
  INDEX idx_user (user_id),
  INDEX idx_company (company_id)
) ENGINE=InnoDB;

-- evaluations (평가)
CREATE TABLE IF NOT EXISTS evaluations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  request_id INT NOT NULL,
  evaluator VARCHAR(50) NOT NULL DEFAULT 'company',
  target VARCHAR(50) NOT NULL DEFAULT 'person',
  score INT NOT NULL,
  comment TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (request_id) REFERENCES match_requests(id) ON DELETE CASCADE,
  INDEX idx_req (request_id)
) ENGINE=InnoDB;


-- ===== 데모 계정 =====
-- 비밀번호: 1234
-- bcrypt 해시 (cost=10)
INSERT INTO users (email, password, name, username, role) VALUES
('user@test.com',
 '$2b$10$e0NRq0w9eZ1sZq5dJYc0J.5Yt1zj0sQk9F7C1gC0y3pQe7Zr6n5eS',
 '이다하', 'user', 'user'),
('admin@test.com',
 '$2b$10$e0NRq0w9eZ1sZq5dJYc0J.5Yt1zj0sQk9F7C1gC0y3pQe7Zr6n5eS',
 '관리자', 'admin', 'admin');

-- 기본 프로필 생성
INSERT INTO profiles (user_id, resume_text)
SELECT id, '' FROM users WHERE email IN ('user@test.com','admin@test.com');

USE picknfeed;
SELECT id, email, name, role, created_at FROM users;

INSERT INTO companies (name, position, skills_json) VALUES
('PicknFeed', 'Flutter Developer', JSON_ARRAY('Dart','Flutter','REST')),
('FusionCrew', 'Backend Node.js', JSON_ARRAY('Node.js','Express','MySQL'));

INSERT INTO people (name, position, skills_json) VALUES
('이다하', 'Backend', JSON_ARRAY('Node.js','MySQL')),
('양은겸', 'Frontend', JSON_ARRAY('Flutter','UI','GetX'));