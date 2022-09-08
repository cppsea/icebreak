const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");

dotenv.config();

const app = express();
const PORT = 5050;

const users = require("./routes/api/users");
const auth = require("./routes/api/auth");

app.use(cors());
app.use(express.json());

app.use(
  session({
    secret: process.env.PASSPORT_SECRET,
    resave: true,
    saveUninitialized: true
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get('/', async (request, response) => {
  response.send("Hello SEA!");
});

app.use('/api/auth', auth);
app.use('/api/users', users);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
})