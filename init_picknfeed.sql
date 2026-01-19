-- Pick&Feed (Minix) 데이터베이스 초기화 스크립트
-- 사용법: MySQL Workbench에서 열어서 전체 실행(⚡)

DROP DATABASE IF EXISTS picknfeed;
CREATE DATABASE picknfeed
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE picknfeed;

-- 1. 유저 (Users)
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  username VARCHAR(50) NULL, -- 선택 사항으로 변경
  role ENUM('PERSONAL','COMPANY','ADMIN') NOT NULL DEFAULT 'PERSONAL',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. 프로필 (Profiles) - 개인 유저용
CREATE TABLE profiles (
  user_id INT PRIMARY KEY,
  resume_text TEXT NULL,
  skills VARCHAR(255) NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 3. 회사 (Companies)
-- 실제 서비스에서는 '기업 유저'와 연결될 수 있지만, 
-- 데모에서는 목록 조회를 위해 별도 테이블로 관리하거나 users와 통합 가능.
-- 여기서는 Frontend 요청(/api/companies)에 맞춰 별도 정보 테이블로 구성
CREATE TABLE companies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT NULL,
  icon_url VARCHAR(255) NULL,
  location VARCHAR(100) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 4. 매칭 요청 (Requests)
CREATE TABLE matching_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,      -- 요청한 개인
  company_id INT NOT NULL,   -- 대상 기업
  status ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 5. 평가 (Evaluations)
CREATE TABLE evaluations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  request_id INT NOT NULL, -- 어떤 매칭 건에 대한 평가인지
  evaluator_id INT NOT NULL, -- 평가자 (주로 기업)
  score INT NOT NULL,
  comment TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (request_id) REFERENCES matching_requests(id) ON DELETE CASCADE
) ENGINE=InnoDB;


-- ===== 초기 데이터 주입 =====

-- 1. 회사 데이터
INSERT INTO companies (name, description, location) VALUES
('Tech Solution', '혁신적인 IT 솔루션을 제공하는 기업입니다.', '서울 강남구'),
('Creative Design', '사용자 경험을 중시하는 디자인 에이전시', '서울 마포구'),
('Global Data', '빅데이터 분석 및 AI 전문 기업', '경기도 성남시'),
('Green Energy', '친환경 에너지 플랫폼', '서울 송파구'),
('Edu Future', '미래 교육을 선도하는 에듀테크', '서울 서초구');

-- 2. 유저 데이터 (비번: 1234)
-- bcrypt hash: $2b$10$e0NRq0w9eZ1sZq5dJYc0J.5Yt1zj0sQk9F7C1gC0y3pQe7Zr6n5eS
INSERT INTO users (email, password, name, role) VALUES
('user@test.com', '$2b$10$e0NRq0w9eZ1sZq5dJYc0J.5Yt1zj0sQk9F7C1gC0y3pQe7Zr6n5eS', '김철수', 'PERSONAL'),
('company@test.com', '$2b$10$e0NRq0w9eZ1sZq5dJYc0J.5Yt1zj0sQk9F7C1gC0y3pQe7Zr6n5eS', '인사담당자', 'COMPANY'),
('admin@test.com', '$2b$10$e0NRq0w9eZ1sZq5dJYc0J.5Yt1zj0sQk9F7C1gC0y3pQe7Zr6n5eS', '관리자', 'ADMIN');

-- 3. 프로필 데이터
INSERT INTO profiles (user_id, resume_text, skills) VALUES
(1, '열정적인 신입 개발자입니다.', 'Flutter, Node.js');

-- 4. 요청 샘플
INSERT INTO matching_requests (user_id, company_id, status) VALUES
(1, 1, 'PENDING'),
(1, 2, 'APPROVED');

SELECT * FROM users;