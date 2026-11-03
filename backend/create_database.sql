-- PostgreSQL Database Creation Script
-- Run this script to create the database for Bloom & Bliss

-- Connect to PostgreSQL as superuser first, then run:
-- psql -U postgres -f create_database.sql

-- Create the database
CREATE DATABASE bloom_db
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.UTF-8'
    LC_CTYPE = 'en_US.UTF-8'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

-- Connect to the new database
\c bloom_db

-- Note: Tables will be created by Laravel migrations
-- Run: php artisan migrate

