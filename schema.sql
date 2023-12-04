-- Author: Simone Gesualdi

-- Date: 28/11/2023

-- Description: this file has the purpose to define the structure of our db

-- Version: 1.0

-- =======================
-- GENERAL RULES FOR THE CODE
-- =======================
-- 1. Use the under_score instead of the CamelCase;
-- 2. The names of the tables must be plural;
-- 3. We have to specify the table of the id (id_name_table);
-- 4. Don't use weird name for fields or tables;
-- 5. Name the foreign key with the name that he has in hih table;
-- 6. Use the uppercase for sql sintax.
--
CREATE TABLE IF NOT EXISTS Users(
    id_user      BIGINT AUTO_INCREMENT PRIMARY KEY,
    email        VARCHAR (50) NOT NULL UNIQUE,
    username     VARCHAR (50) NOT NULL,
    password     VARCHAR (50) NOT NULL,
    has_verified BOOLEAN DEFAULT FALSE,
    has_mfa      BOOLEAN DEFAULT FALSE,
    iban         VARCHAR(20), -- in the future I plan a better organization with a new table
    insert_date  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_date  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- A user who want to verify his account has to use the link in the table which refers to his account
CREATE TABLE IF NOT EXISTS Verify_links(
    id_team    BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    description VARCHAR(255) NOT NULL,
    password    VARCHAR(255), -- it can be NULL if the Team doesn't have a password
    insert_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Teams(
    id_team    BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    description VARCHAR(255) NOT NULL,
    password    VARCHAR(255), -- it can be NULL if the Team doesn't have a password
    insert_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Teams_users(
    id_team_users BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_team       BIGINT REFERENCES Teams(id_team) ON UPDATE CASCADE ON DELETE RESTRICT,
    id_user        BIGINT REFERENCES Users(id_user) ON UPDATE CASCADE ON DELETE RESTRICT,
    insert_date    DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Users_messages(
    id_message  BIGINT AUTO_INCREMENT PRIMARY KEY,
    text        VARCHAR (1023) NOT NULL,
    id_sender   BIGINT REFERENCES Users(id_user) ON UPDATE CASCADE ON DELETE RESTRICT,
    id_receiver BIGINT REFERENCES Users(id_user) ON UPDATE CASCADE ON DELETE RESTRICT,
    insert_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS teams_messages(
    id_message  BIGINT AUTO_INCREMENT PRIMARY KEY,
    text        VARCHAR (1023) NOT NULL,
    id_user     BIGINT REFERENCES Users(id_user) ON UPDATE CASCADE ON DELETE RESTRICT,
    id_team    BIGINT REFERENCES Teams(id_team) ON UPDATE CASCADE ON DELETE RESTRICT,
    insert_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);