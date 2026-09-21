-- ============================================
-- Student Placement Management System - Schema
-- ============================================

CREATE DATABASE IF NOT EXISTS placement_db;
USE placement_db;

DROP TABLE IF EXISTS applications;
DROP TABLE IF EXISTS jobs;
DROP TABLE IF EXISTS students;

-- ----------------------------
-- STUDENTS
-- ----------------------------
CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    college VARCHAR(150),
    degree VARCHAR(100),
    graduation_year VARCHAR(10),
    skills VARCHAR(255)
);

-- ----------------------------
-- JOBS
-- ----------------------------
CREATE TABLE jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_name VARCHAR(150) NOT NULL,
    job_title VARCHAR(150) NOT NULL,
    location VARCHAR(100),
    job_type VARCHAR(50),
    experience VARCHAR(50),
    skills VARCHAR(255),
    description TEXT,
    posted_date DATE
);

-- ----------------------------
-- APPLICATIONS
-- References both students and jobs.
-- ----------------------------
CREATE TABLE applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    job_id INT NOT NULL,
    applicant_name VARCHAR(100),
    applicant_email VARCHAR(100),
    applicant_phone VARCHAR(20),
    applicant_skills VARCHAR(255),
    resume_link VARCHAR(255),
    cover_letter TEXT,
    status VARCHAR(30) DEFAULT 'Applied',
    applied_date DATE,
    CONSTRAINT fk_applications_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE SET NULL,
    CONSTRAINT fk_applications_job FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
);


-- SELECT: applications belonging to one logged-in student
-- SELECT a.id, s.name, s.email, j.company_name, j.job_title, a.status, a.applied_date
-- FROM applications a
-- JOIN students s ON a.student_id = s.id
-- JOIN jobs j ON a.job_id = j.id
-- WHERE a.student_id = 1;

-- UPDATE: mark an application as Selected
-- UPDATE applications SET status = 'Selected' WHERE id = 1;

-- DELETE: withdraw an application
-- DELETE FROM applications WHERE id = 1;

-- JOIN: full application info with student + job details
-- SELECT
--     a.id AS application_id,
--     s.name AS student_name,
--     j.company_name,
--     j.job_title,
--     a.status,
--     a.applied_date
-- FROM applications a
-- JOIN students s ON a.student_id = s.id
-- JOIN jobs j ON a.job_id = j.id
-- ORDER BY a.applied_date DESC;
