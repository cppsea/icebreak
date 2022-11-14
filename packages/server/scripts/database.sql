CREATE TABLE users (
  user_id varchar(255) PRIMARY KEY NOT NULL,
  joined_date TIMESTAMP,
  last_login TIMESTAMP,
  first_name varchar(50) NOT NULL,
  last_name varchar(50) NOT NULL,
  email varchar(255) UNIQUE NOT NULL,
  avatar varchar(255) NOT NULL
);

CREATE TABLE Guild (
  guild_id VARCHAR(255),
  name VARCHAR(100),
  handler VARCHAR(50),
  description TEXT,
  media TEXT[],
  invite_only BOOLEAN,
  PRIMARY KEY(guild_id)
);

CREATE TABLE Event (
  event_id VARCHAR(255),
  guild_id VARCHAR(255),
  title VARCHAR(255),
  description VARCHAR(255),
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  location VARCHAR(255),
  thumbnail VARCHAR(255),
  PRIMARY KEY(event_id),
  FOREIGN KEY(guild_id)
    REFERENCES Guild(guild_id) 
    ON UPDATE CASCADE
    ON DELETE SET NULL
);

CREATE TABLE user_guild (
  user_id VARCHAR(255),
  guild_id VARCHAR(255),
  FOREIGN KEY(user_id)
    REFERENCES users(user_id)
    ON UPDATE CASCADE
    ON DELETE SET NULL,
  FOREIGN KEY(guild_id)
    REFERENCES Guild(guild_id)
    ON UPDATE CASCADE
    ON DELETE SET NULL,
  PRIMARY KEY(user_id, guild_id),
  user_role VARCHAR(255),
  points SMALLINT,
  user_admin SMALLINT
);

CREATE TABLE members_pending (
  user_id VARCHAR(255),
  event_id VARCHAR(255),
  FOREIGN KEY(user_id)
    REFERENCES users(user_id)
    ON UPDATE CASCADE
    ON DELETE SET NULL,
  FOREIGN KEY(event_id)
    REFERENCES Event(event_id)
    ON UPDATE CASCADE
    ON DELETE SET NULL
);

INSERT INTO Guild
VALUES (
  'nfb38fv30fb339fb',
  'Software Engineering Association',
  'cppsea',
  'The Software Engineering Association (SEA) teaches and encourages the professional skills needed to be a Software Engineer, including code review, unit testing, communication, and software design. Our online and in-meeting exercises allow anyone, novice or professional, to sharpen and practice these skills.',
  '{https://www.instagram.com/cpp.sea, https://github.com/cppsea}',
  true
);

INSERT INTO Event
VALUES (
  '384629bffb28f2',
  'nfb38fv30fb339fb',
  'SEA goes to Innovation Brew Works',
  'Come join us for our first social hangout at the Innovation Brew Works. Meet other SEA members while playing board games and munching on food.',
  '2022-10-14 19:00:00',
  '2022-10-14 22:00:00',
  '3650 W Temple Ave, Pomona, CA 91768',
  'https://thepolypost.com/wp-content/uploads/2018/02/t9u2ajcvo6bemz7qbahg.jpg'
);

INSERT INTO users (user_id, first_name, last_name, email, avatar) 
VALUES (
  'sdfdf2f2bf2efgasdfssfsdff',
  'bob',
  'smith',
  'bob.smith@cpp.com',
  'https://www.memesmonkey.com/images/memesmonkey/24/2422d8b276a25c2ef0d1601b9332bc36.jpeg'
);