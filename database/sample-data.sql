-- ============================================
-- Sample Data for Student Placement Management System
-- Run this AFTER schema.sql
-- ============================================

USE placement_db;

-- ----------------------------
-- STUDENTS
-- ----------------------------
INSERT INTO students (name, email, password, phone, college, degree, graduation_year, skills) VALUES
('Anushka Singh', 'anushka@example.com', 'anushka123', '9876543210', 'Guru Nanak Institute of Technology', 'B.Tech Computer Science', '2027', 'Java, Spring Boot, SQL, JavaScript, Salesforce');

-- ----------------------------
-- JOBS
-- ----------------------------
INSERT INTO jobs (company_name, job_title, location, job_type, experience, skills, description, posted_date) VALUES
('TechNova Solutions', 'Java Developer', 'Bangalore', 'Full Time', '0-1 years', 'Java, Spring Boot, SQL',
 'Work on backend microservices for enterprise clients. Strong fundamentals in Java and REST APIs required.', '2026-09-01'),

('PixelCraft Studios', 'Frontend Developer', 'Pune', 'Full Time', '0-2 years', 'HTML, CSS, JavaScript, React',
 'Build responsive, pixel-perfect UIs for consumer-facing web apps.', '2026-09-03'),

('DataSense Analytics', 'Data Analyst', 'Hyderabad', 'Full Time', '0-1 years', 'SQL, Excel, Python, Power BI',
 'Analyze business data and build dashboards to support decision-making.', '2026-09-05'),

('CloudForce Systems', 'Salesforce Developer', 'Remote', 'Full Time', '0-1 years', 'Salesforce, Apex, LWC, SOQL',
 'Develop and customize Salesforce applications for CRM clients.', '2026-09-06'),

('Nimbus Tech', 'Full Stack Developer', 'Bangalore', 'Full Time', '1-2 years', 'Java, Spring Boot, React, MySQL',
 'End-to-end feature development across frontend and backend.', '2026-09-08'),

('BrightPath Software', 'Software Engineer Intern', 'Kolkata', 'Internship', '0 years', 'Java, DSA, Git',
 'Internship opportunity for final-year students to work on real production code.', '2026-09-10'),

('Orbit Systems', 'Software Developer', 'Chennai', 'Full Time', '0-1 years', 'Java, SQL, Spring Boot',
 'Join our core engineering team building scalable backend services.', '2026-09-11'),

('Vertex Innovations', 'Java Developer', 'Noida', 'Full Time', '1-3 years', 'Java, Hibernate, MySQL, REST APIs',
 'Maintain and enhance backend systems for a fintech product.', '2026-09-12'),

('QuantumEdge Technologies', 'Frontend Developer', 'Mumbai', 'Full Time', '0-2 years', 'JavaScript, HTML, CSS, Vue',
 'Craft engaging, high-performance interfaces for a SaaS dashboard.', '2026-09-13'),

('Sterling Analytics', 'Data Analyst', 'Remote', 'Internship', '0 years', 'SQL, Python, Excel',
 'Support the analytics team with data cleaning and reporting.', '2026-09-14'),

('Helix Cloud Labs', 'Full Stack Developer', 'Gurgaon', 'Full Time', '0-1 years', 'JavaScript, Java, MySQL, Spring Boot',
 'Build features across the stack for a fast-growing cloud platform.', '2026-09-15'),

('Marvel Softwares', 'Software Developer', 'Bangalore', 'Internship', '0 years', 'Java, SQL, Problem Solving',
 'Great starting point for students strong in DSA and core Java.', '2026-09-16');

-- ----------------------------
-- APPLICATIONS
-- (linking student_id = 1 to a few jobs above)
-- ----------------------------
INSERT INTO applications (student_id, job_id, applicant_name, applicant_email, applicant_phone, applicant_skills, resume_link, cover_letter, status, applied_date) VALUES
(1, 1, 'Anushka Singh', 'anushka@example.com', '9876543210', 'Java, Spring Boot, SQL', 'https://drive.google.com/resume-anushka', 'I am excited to apply for the Java Developer role at TechNova.', 'Under Review', '2026-09-15'),
(1, 4, 'Anushka Singh', 'anushka@example.com', '9876543210', 'Salesforce, Apex, LWC', 'https://drive.google.com/resume-anushka', 'My Salesforce project experience aligns well with this role.', 'Shortlisted', '2026-09-16'),
(1, 7, 'Anushka Singh', 'anushka@example.com', '9876543210', 'Java, SQL, Spring Boot', 'https://drive.google.com/resume-anushka', 'Applying for the Software Developer role at Orbit Systems.', 'Applied', '2026-09-18'),
(1, 11, 'Anushka Singh', 'anushka@example.com', '9876543210', 'JavaScript, Java, MySQL', 'https://drive.google.com/resume-anushka', 'Interested in the Full Stack Developer opportunity.', 'Applied', '2026-09-19'),
(1, 6, 'Anushka Singh', 'anushka@example.com', '9876543210', 'Java, DSA, Git', 'https://drive.google.com/resume-anushka', 'Would love the internship opportunity at BrightPath.', 'Selected', '2026-09-10');
