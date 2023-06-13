const cleanUpConnections = require("./setup-tests");
const axios = require("axios");

afterAll(() => {
  cleanUpConnections();
});

describe("Example test group", () => {
  console.log("hello");

  test("Hello SEA request", async () => {
    const response = await axios.get("http://localhost:5050");
    const greeting = await response.data;

    expect(greeting).toBe("Hello SEA!");
  });
});
