-- Author: Simone Gesualdi
-- Date: 28/11/2023
-- Description: This file defines the structure of our database
-- Version: 2.0
-- RDBMS: Postgresql

-- =======================
-- GENERAL RULES FOR THE CODE
-- =======================
-- 1. Use under_score instead of CamelCase;
-- 2. Table names should be plural;
-- 3. Specify the table of the id (id_name_table);
-- 4. Don't use weird names for fields or tables;
-- 5. Name foreign keys with the name they have in the referenced table;
-- 6. Use uppercase for SQL syntax.
-- In future, this line can be very useful:
-- TRUNCATE users, user_tokens, verify_links, teams_users, users_messages, teams_messages;


CREATE TABLE IF NOT EXISTS users (
    id_user      BIGSERIAL PRIMARY KEY, -- BIGSERIAL is the same of auto_increment in my_sql
    email        VARCHAR(50) NOT NULL UNIQUE,
    username     VARCHAR(50) NOT NULL,
    password     VARCHAR(255) NOT NULL,
    has_verified BOOLEAN DEFAULT FALSE,
    has_mfa      BOOLEAN DEFAULT FALSE,
    iban         VARCHAR(20),
    insert_date  TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    update_date  TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_tokens (
    id_user_token BIGSERIAL PRIMARY KEY,
    id_user       BIGINT REFERENCES users(id_user) ON UPDATE CASCADE ON DELETE RESTRICT,
    refresh_token VARCHAR(255) UNIQUE,
    insert_date   TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    update_date   TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- A user who wants to verify their account has to use the link in the table that refers to their account
CREATE TABLE IF NOT EXISTS verify_links (
    id_verify_link BIGSERIAL PRIMARY KEY,
    id_user        BIGINT UNIQUE REFERENCES users(id_user) ON DELETE CASCADE ON UPDATE CASCADE,
    token          VARCHAR(100),
    insert_date    TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    update_date    TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS teams (
    id_team      BIGSERIAL PRIMARY KEY,
    name         VARCHAR(100) NOT NULL,
    description  VARCHAR(255) NOT NULL,
    password     VARCHAR(255), -- It can be NULL if the team doesn't have a password
    insert_date  TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    update_date  TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS teams_users (
    id_team_users BIGSERIAL PRIMARY KEY,
    id_team       BIGINT REFERENCES teams(id_team) ON UPDATE CASCADE ON DELETE RESTRICT,
    id_user       BIGINT REFERENCES users(id_user) ON UPDATE CASCADE ON DELETE RESTRICT,
    insert_date   TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users_messages (
    id_message   BIGSERIAL PRIMARY KEY,
    text         VARCHAR(1023) NOT NULL,
    id_sender    BIGINT REFERENCES users(id_user) ON UPDATE CASCADE ON DELETE RESTRICT,
    id_receiver  BIGINT REFERENCES users(id_user) ON UPDATE CASCADE ON DELETE RESTRICT,
    insert_date  TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    update_date  TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS teams_messages (
    id_message   BIGSERIAL PRIMARY KEY,
    text         VARCHAR(1023) NOT NULL,
    id_user      BIGINT REFERENCES users(id_user) ON UPDATE CASCADE ON DELETE RESTRICT,
    id_team      BIGINT REFERENCES teams(id_team) ON UPDATE CASCADE ON DELETE RESTRICT,
    insert_date  TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    update_date  TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
