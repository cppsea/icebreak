CREATE TABLE users (
  user_id varchar(255) UNIQUE PRIMARY KEY NOT NULL,
  joined_date TIMESTAMP,
  last_login TIMESTAMP,
  first_name varchar(50) NOT NULL,
  last_name varchar(50) NOT NULL,
  email varchar(255) UNIQUE NOT NULL,
  avatar varchar(255) NOT NULL
);

INSERT INTO users (user_id, first_name, last_name, email, avatar) 
VALUES (
  'sdfdf2f2bf2efgasdfssfsdff',
  'bob',
  'smith',
  'bob.smith@cpp.com',
  'https://www.memesmonkey.com/images/memesmonkey/24/2422d8b276a25c2ef0d1601b9332bc36.jpeg'
);