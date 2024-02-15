import axios from "axios";
import { expect } from "chai";

axios.defaults.baseURL = "http://localhost:8080";

describe("User Endpoint Integration Tests", () => {
  it("should create an account and validate its existence with GET", async () => {
    // POST request to create a new user
    const createUserRes = await axios.post("/v1/user", {
      first_name: "Alice",
      last_name: "Smith",
      email: "alicesmith@example.com",
      password: "Anirudh@18",
    });
    expect(createUserRes.status).to.equal(201);
    const userId = createUserRes.data.id;
    // Authenticate
    const authHeader = `Basic ${Buffer.from(
      "alicesmith@example.com:Anirudh@18"
    ).toString("base64")}`;
    // Send a GET request
    const getUserRes = await axios.get("/v1/user/self", {
      headers: {
        Authorization: authHeader,
      },
    });
    expect(getUserRes.status).to.equal(200);
    expect(getUserRes.data.id).to.equal(userId);
  });

  it("should update an account and validate the changes with GET", async () => {
    // Authenticate
    const authHeader = `Basic ${Buffer.from(
      "alicesmith@example.com:Anirudh@18"
    ).toString("base64")}`;
    // Send a PUT request
    const updateUserRes = await axios.put("/v1/user/self", {
      first_name: 'Bob',
      last_name: 'Johnson',
      password: 'Anirudh@18'
    }, {
      headers: {
        Authorization: authHeader,
      },
    });
    expect(updateUserRes.status).to.equal(204);
    // Send a GET request
    const getUserRes = await axios.get("/v1/user/self", {
      headers: {
        Authorization: authHeader,
      },
    });
    expect(getUserRes.status).to.equal(200);
    expect(getUserRes.data.first_name).to.equal("Bob");
  });
});