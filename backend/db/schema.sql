CREATE DATABASE IF NOT EXISTS recycling_manager_selection
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE recycling_manager_selection;

CREATE TABLE IF NOT EXISTS candidates (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL,
  phone VARCHAR(30) NULL,
  location_city VARCHAR(80) NOT NULL,
  location_state VARCHAR(80) NOT NULL,
  location_country VARCHAR(80) NOT NULL DEFAULT 'USA',
  years_experience DECIMAL(4,1) UNSIGNED NOT NULL,
  highest_education ENUM(
    'High School',
    'Associate',
    'Bachelor',
    'Master',
    'Doctorate',
    'Professional Certificate'
  ) NOT NULL,
  current_role VARCHAR(120) NOT NULL,
  industry_focus VARCHAR(120) NOT NULL,
  profile_summary TEXT NOT NULL,
  skills_json JSON NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT uq_candidates_email UNIQUE (email),
  CONSTRAINT chk_candidates_experience CHECK (years_experience BETWEEN 0 AND 45),
  CONSTRAINT chk_candidates_skills_json CHECK (JSON_VALID(skills_json))
) ENGINE=InnoDB;

CREATE INDEX idx_candidates_location ON candidates (location_state, location_city);
CREATE INDEX idx_candidates_experience ON candidates (years_experience);
CREATE INDEX idx_candidates_role ON candidates (current_role);

CREATE TABLE IF NOT EXISTS skills (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  skill_name VARCHAR(80) NOT NULL,
  category ENUM(
    'Operations',
    'Leadership',
    'Compliance',
    'Sustainability',
    'Safety',
    'Analytics'
  ) NOT NULL,
  CONSTRAINT uq_skills_name UNIQUE (skill_name)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS candidate_skills (
  candidate_id BIGINT UNSIGNED NOT NULL,
  skill_id BIGINT UNSIGNED NOT NULL,
  proficiency TINYINT UNSIGNED NOT NULL,
  PRIMARY KEY (candidate_id, skill_id),
  CONSTRAINT fk_candidate_skills_candidate
    FOREIGN KEY (candidate_id)
    REFERENCES candidates(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_candidate_skills_skill
    FOREIGN KEY (skill_id)
    REFERENCES skills(id)
    ON DELETE RESTRICT,
  CONSTRAINT chk_candidate_skill_proficiency CHECK (proficiency BETWEEN 1 AND 5)
) ENGINE=InnoDB;

CREATE INDEX idx_candidate_skills_skill ON candidate_skills (skill_id, proficiency);

CREATE TABLE IF NOT EXISTS evaluations (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  candidate_id BIGINT UNSIGNED NOT NULL,
  evaluator_version VARCHAR(32) NOT NULL DEFAULT 'v1',
  crisis_score TINYINT UNSIGNED NOT NULL,
  sustainability_score TINYINT UNSIGNED NOT NULL,
  motivation_score TINYINT UNSIGNED NOT NULL,
  overall_score DECIMAL(5,2)
    AS (ROUND((crisis_score * 0.40) + (sustainability_score * 0.35) + (motivation_score * 0.25), 2)) STORED,
  justification_json JSON NOT NULL,
  evaluated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_evaluations_candidate
    FOREIGN KEY (candidate_id)
    REFERENCES candidates(id)
    ON DELETE CASCADE,
  CONSTRAINT chk_evaluations_crisis CHECK (crisis_score BETWEEN 0 AND 100),
  CONSTRAINT chk_evaluations_sustainability CHECK (sustainability_score BETWEEN 0 AND 100),
  CONSTRAINT chk_evaluations_motivation CHECK (motivation_score BETWEEN 0 AND 100),
  CONSTRAINT chk_evaluations_justification_json CHECK (JSON_VALID(justification_json))
) ENGINE=InnoDB;

CREATE INDEX idx_evaluations_candidate_date ON evaluations (candidate_id, evaluated_at DESC);
CREATE INDEX idx_evaluations_overall ON evaluations (overall_score DESC, evaluated_at DESC);
CREATE INDEX idx_evaluations_version ON evaluations (evaluator_version);