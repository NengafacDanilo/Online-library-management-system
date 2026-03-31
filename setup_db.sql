-- Create database
CREATE DATABASE lms_db;

-- Create user
CREATE USER postgres WITH PASSWORD 'postgres';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE lms_db TO postgres;

-- Connect to the database and grant schema privileges
\c lms_db
GRANT ALL ON SCHEMA public TO postgres;
