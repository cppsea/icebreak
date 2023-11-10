import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;

import users from "./routes/api/users";
import guilds from "./routes/api/guilds";
import events from "./routes/api/events";
import auth from "./routes/api/auth";
import images from "./routes/api/images";

app.use(
  cors({
    origin: ["icebreak://", "http://localhost:8081"],
    credentials: true
  })
);

app.use(cookieParser());
app.use(express.json({ limit: "20mb" }));

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
