const express = require("express");
const app = express();

const PORT = 3000;

app.get('/', (request, response) => {
  response.send("Hello SEA!");
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
})