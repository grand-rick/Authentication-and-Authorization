CREATE TABLE articles (id SERIAL PRIMARY KEY, title VARCHAR(50), content text);
CREATE TABLE users (id SERIAL PRIMARY KEY, username VARCHAR(50), password_digest VARCHAR);