CREATE TABLE articles (id SERIAL PRIMARY KEY, title VARCHAR(50), content text);
CREATE TABLE users (id SERIAL PRIMARY KEY, first_name VARCHAR(50), last_name VARCHAR(50), username VARCHAR(50), password_digest VARCHAR(50));