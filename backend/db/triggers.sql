USE recycling_manager_selection;

DROP TRIGGER IF EXISTS trg_evaluations_before_insert;
DROP TRIGGER IF EXISTS trg_evaluations_before_update;
DROP TRIGGER IF EXISTS trg_candidates_before_insert;

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

DELIMITER ;