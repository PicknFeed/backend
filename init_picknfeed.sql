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

-- 2. 개인 프로필 (이력서/포지션/스킬)
CREATE TABLE profiles (
  user_id INT PRIMARY KEY,
  resume_text TEXT NULL,
  position VARCHAR(100) NULL,
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
  position VARCHAR(100) NULL,
  skills_json TEXT NULL,
  description TEXT NULL,
  icon_url VARCHAR(255) NULL,
  location VARCHAR(100) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 4. 매칭 요청 (Requests)
CREATE TABLE matching_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  company_id INT NOT NULL,
  status ENUM('PENDING','APPROVED','REJECTED') NOT NULL DEFAULT 'PENDING',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 5. 평가 (Evaluations) (기업이 작성 → 개인이 조회)
CREATE TABLE evaluations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  request_id INT NOT NULL, -- 어떤 매칭 건에 대한 평가인지
  evaluator_id INT NOT NULL, -- 평가자 (주로 기업)
  score INT NOT NULL,
  comment TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (request_id) REFERENCES matching_requests(id) ON DELETE CASCADE,
  FOREIGN KEY (evaluator_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE resume_files (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  stored_name VARCHAR(255) NOT NULL,
  mime VARCHAR(100) NULL,
  size INT NULL,
  url VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;


-- 샘플 데이터

-- 1. 회사 데이터
INSERT INTO companies (name, description, location) VALUES
('Tech Solution', '혁신적인 IT 솔루션을 제공하는 기업입니다.', '서울 강남구'),
('Creative Design', '사용자 경험을 중시하는 디자인 에이전시', '서울 마포구'),
('Global Data', '빅데이터 분석 및 AI 전문 기업', '경기도 성남시'),
('Green Energy', '친환경 에너지 플랫폼', '서울 송파구'),
('Edu Future', '미래 교육을 선도하는 에듀테크', '서울 서초구');

-- 2. 유저 데이터 (비번: 1234)
-- 비번: 1234 (너가 기존에 넣던 bcrypt hash 그대로)
INSERT INTO users (email, password, name, role) VALUES
('user@test.com',    '$2b$10$e0NRq0w9eZ1sZq5dJYc0J.5Yt1zj0sQk9F7C1gC0y3pQe7Zr6n5eS', '김철수', 'PERSONAL'),
('company@test.com', '$2b$10$e0NRq0w9eZ1sZq5dJYc0J.5Yt1zj0sQk9F7C1gC0y3pQe7Zr6n5eS', '인사담당자', 'COMPANY'),
('admin@test.com',   '$2b$10$e0NRq0w9eZ1sZq5dJYc0J.5Yt1zj0sQk9F7C1gC0y3pQe7Zr6n5eS', '관리자', 'ADMIN');

INSERT INTO profiles (user_id, resume_text, position, skills) VALUES
(1, '열정적인 신입 개발자입니다.', 'Flutter Developer', 'Flutter, Node.js, MySQL');

INSERT INTO companies (name, position, skills_json, description, location) VALUES
('Tech Solution', 'Flutter Developer', '["Flutter","REST","MySQL"]', '혁신적인 IT 솔루션 기업', '서울 강남구'),
('Creative Design', 'UI/UX Designer', '["Figma","UX","Prototype"]', '디자인 에이전시', '서울 마포구'),
('Global Data', 'Data Engineer', '["Python","SQL","Airflow"]', '빅데이터/AI 기업', '경기도 성남시');

INSERT INTO matching_requests (user_id, company_id, status) VALUES
(1, 1, 'PENDING'),
(1, 2, 'APPROVED');