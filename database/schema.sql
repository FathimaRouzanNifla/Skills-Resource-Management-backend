-- Create database
CREATE DATABASE IF NOT EXISTS skills_management;
USE skills_management;

-- Personnel table
CREATE TABLE personnel (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role_title VARCHAR(100),
    experience_level ENUM('Junior', 'Mid-Level', 'Senior') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Skills table
CREATE TABLE skills (
    id INT PRIMARY KEY AUTO_INCREMENT,
    skill_name VARCHAR(100) NOT NULL,
    category ENUM('Programming Language', 'Framework', 'Tool', 'Soft Skill') NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Personnel skills junction table with proficiency
CREATE TABLE personnel_skills (
    id INT PRIMARY KEY AUTO_INCREMENT,
    personnel_id INT NOT NULL,
    skill_id INT NOT NULL,
    proficiency ENUM('Beginner', 'Intermediate', 'Advanced', 'Expert') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (personnel_id) REFERENCES personnel(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE,
    UNIQUE KEY unique_personnel_skill (personnel_id, skill_id)
);

-- Projects table
CREATE TABLE projects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    project_name VARCHAR(200) NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    status ENUM('Planning', 'Active', 'Completed') DEFAULT 'Planning',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Project required skills table
CREATE TABLE project_required_skills (
    id INT PRIMARY KEY AUTO_INCREMENT,
    project_id INT NOT NULL,
    skill_id INT NOT NULL,
    min_proficiency ENUM('Beginner', 'Intermediate', 'Advanced', 'Expert') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE,
    UNIQUE KEY unique_project_skill (project_id, skill_id)
);

-- Sample data
INSERT INTO personnel (name, email, role_title, experience_level) VALUES
('John Smith', 'john.smith@company.com', 'Frontend Developer', 'Mid-Level'),
('Sarah Johnson', 'sarah.j@company.com', 'Backend Developer', 'Senior'),
('Mike Wilson', 'mike.w@company.com', 'Full Stack Developer', 'Junior');

INSERT INTO skills (skill_name, category, description) VALUES
('JavaScript', 'Programming Language', 'Core JavaScript programming'),
('React', 'Framework', 'React library for building UIs'),
('Node.js', 'Framework', 'JavaScript runtime environment'),
('Python', 'Programming Language', 'Python programming language'),
('Communication', 'Soft Skill', 'Verbal and written communication'),
('Git', 'Tool', 'Version control system');

INSERT INTO personnel_skills (personnel_id, skill_id, proficiency) VALUES
(1, 1, 'Advanced'),  -- John: JavaScript Advanced
(1, 2, 'Expert'),    -- John: React Expert
(2, 3, 'Expert'),    -- Sarah: Node.js Expert
(2, 4, 'Advanced'),  -- Sarah: Python Advanced
(3, 1, 'Intermediate'), -- Mike: JavaScript Intermediate
(3, 2, 'Beginner');     -- Mike: React Beginner

INSERT INTO projects (project_name, description, start_date, end_date, status) VALUES
('E-commerce Platform', 'Build online shopping platform', '2024-01-15', '2024-06-30', 'Active'),
('Internal Dashboard', 'Company analytics dashboard', '2024-02-01', NULL, 'Planning');

INSERT INTO project_required_skills (project_id, skill_id, min_proficiency) VALUES
(1, 1, 'Advanced'),  -- E-commerce needs JavaScript Advanced
(1, 2, 'Advanced'),  -- E-commerce needs React Advanced
(2, 1, 'Intermediate'), -- Dashboard needs JavaScript Intermediate
(2, 5, 'Intermediate'); -- Dashboard needs Communication Intermediate