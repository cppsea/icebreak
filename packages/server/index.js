const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

const users = require("./controllers/users");

app.use(cors());
app.use(express.json());

app.get('/', async (request, response) => {
  response.send("Hello SEA!");
});

app.use('/api/users', users);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
})