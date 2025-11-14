-- 01_create_common_user.sql

-- Switch to the root container to create a common user
ALTER SESSION SET CONTAINER = CDB$ROOT;

-- Enable the use of substitution variables
SET DEFINE ON
-- Disable the verification of substitution variables
SET VERIFY OFF

-- Create a common user if it does not already exist
DECLARE
  v_user_exists NUMBER;
BEGIN
  -- Check if the user (read from the environment variable) already exists
  -- Note the use of single quotes for the username
  SELECT COUNT(*) INTO v_user_exists FROM dba_users WHERE username = 'dev';
  -- If the user does not exist, create it
  IF v_user_exists = 0 THEN
    -- Create the user using environment variables for the name and password
    EXECUTE IMMEDIATE 'CREATE USER dev IDENTIFIED BY devpass12345 CONTAINER=ALL';
    -- Grant permissions to the new user
    EXECUTE IMMEDIATE 'GRANT CREATE SESSION, RESOURCE TO dev CONTAINER=ALL';
    -- Grant unlimited tablespace to the new user
    EXECUTE IMMEDIATE 'GRANT UNLIMITED TABLESPACE TO dev CONTAINER=ALL';
    COMMIT;
  END IF;
END;
/