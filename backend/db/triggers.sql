USE recycling_manager_selection;

DROP TRIGGER IF EXISTS trg_evaluations_before_insert;
DROP TRIGGER IF EXISTS trg_evaluations_before_update;
DROP TRIGGER IF EXISTS trg_evaluations_after_insert;
DROP TRIGGER IF EXISTS trg_evaluations_after_update;
DROP TRIGGER IF EXISTS trg_evaluations_after_delete;
DROP TRIGGER IF EXISTS trg_candidates_before_insert;
DROP PROCEDURE IF EXISTS sp_refresh_rankings;

DELIMITER $$

CREATE TRIGGER trg_evaluations_before_insert
BEFORE INSERT ON evaluations
FOR EACH ROW
BEGIN
  IF NEW.crisis_score < 0 OR NEW.crisis_score > 100 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'crisis_score must be between 0 and 100';
  END IF;

  IF NEW.sustainability_score < 0 OR NEW.sustainability_score > 100 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'sustainability_score must be between 0 and 100';
  END IF;

  IF NEW.motivation_score < 0 OR NEW.motivation_score > 100 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'motivation_score must be between 0 and 100';
  END IF;

  IF NEW.evaluator_version IS NULL OR CHAR_LENGTH(TRIM(NEW.evaluator_version)) = 0 THEN
    SET NEW.evaluator_version = 'v1';
  END IF;
END$$

CREATE TRIGGER trg_evaluations_before_update
BEFORE UPDATE ON evaluations
FOR EACH ROW
BEGIN
  IF NEW.crisis_score < 0 OR NEW.crisis_score > 100 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'crisis_score must be between 0 and 100';
  END IF;

  IF NEW.sustainability_score < 0 OR NEW.sustainability_score > 100 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'sustainability_score must be between 0 and 100';
  END IF;

  IF NEW.motivation_score < 0 OR NEW.motivation_score > 100 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'motivation_score must be between 0 and 100';
  END IF;

  IF NEW.evaluator_version IS NULL OR CHAR_LENGTH(TRIM(NEW.evaluator_version)) = 0 THEN
    SET NEW.evaluator_version = OLD.evaluator_version;
  END IF;
END$$

CREATE TRIGGER trg_candidates_before_insert
BEFORE INSERT ON candidates
FOR EACH ROW
BEGIN
  SET NEW.full_name = TRIM(NEW.full_name);
  SET NEW.email = LOWER(TRIM(NEW.email));
END$$

CREATE PROCEDURE sp_refresh_rankings()
BEGIN
  DELETE FROM rankings;

  INSERT INTO rankings (
    candidate_id,
    latest_evaluation_id,
    rank_position,
    overall_score
  )
  WITH latest_evaluations AS (
    SELECT
      e.id,
      e.candidate_id,
      e.overall_score,
      e.evaluated_at,
      ROW_NUMBER() OVER (PARTITION BY e.candidate_id ORDER BY e.evaluated_at DESC, e.id DESC) AS rn
    FROM evaluations e
  ),
  ranked AS (
    SELECT
      le.id AS latest_evaluation_id,
      le.candidate_id,
      le.overall_score,
      DENSE_RANK() OVER (ORDER BY le.overall_score DESC, c.years_experience DESC, c.id ASC) AS rank_position
    FROM latest_evaluations le
    JOIN candidates c
      ON c.id = le.candidate_id
    WHERE le.rn = 1
  )
  SELECT
    r.candidate_id,
    r.latest_evaluation_id,
    r.rank_position,
    r.overall_score
  FROM ranked r
  ORDER BY r.rank_position ASC, r.candidate_id ASC;
END$$

CREATE TRIGGER trg_evaluations_after_insert
AFTER INSERT ON evaluations
FOR EACH ROW
BEGIN
  CALL sp_refresh_rankings();
END$$

CREATE TRIGGER trg_evaluations_after_update
AFTER UPDATE ON evaluations
FOR EACH ROW
BEGIN
  CALL sp_refresh_rankings();
END$$

CREATE TRIGGER trg_evaluations_after_delete
AFTER DELETE ON evaluations
FOR EACH ROW
BEGIN
  CALL sp_refresh_rankings();
END$$

DELIMITER ;
