CREATE TABLE IF NOT EXISTS users (
                                     id SERIAL PRIMARY KEY,
                                     last_name VARCHAR(255) NOT NULL,
                                     first_name VARCHAR(255) NOT NULL,
                                     email VARCHAR(255) NOT NULL UNIQUE,
                                     birth_date DATE NOT NULL,
                                     city VARCHAR(255) NOT NULL,
                                     postal_code VARCHAR(10) NOT NULL,
                                     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);