const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const passport = require("passport");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;

const users = require("./routes/api/users");
const guilds = require("./routes/api/guilds");
const events = require("./routes/api/events");
const auth = require("./routes/api/auth");
const images = require("./routes/api/images");

app.use(
  cors({
    origin: ["icebreak://", "http://localhost:8081"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json({ limit: "20mb" }));

app.use(passport.initialize());

app.get("/", async (request, response) => {
  response.send("Hello SEA!");
});

app.use("/api/auth", auth);
app.use("/api/users", users);
app.use("/api/guilds", guilds);
app.use("/api/events", events);
app.use("/api/media/images", images);

const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

module.exports = server;
