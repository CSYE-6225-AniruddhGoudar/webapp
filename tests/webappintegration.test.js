import request from 'supertest';
import app from '../src/apiServer.js';

let appNetwork;

beforeAll(() => {
  appNetwork = app.listen();
});

afterAll(() => {
  appNetwork.close();
});


describe("Health Check", () => {
  it("200 should be expecting", async () => {
    const res = await request(app).get("/healthz");
    expect(res.statusCode).toEqual(200);
  });
});

describe("405 for other methods", () => {
  it("405 invalid", async () => {
    const res = await request(app).put("/healthz");
    expect(res.statusCode).toEqual(405);
  });
});

describe("Invalid param", () => {
  it("Expect 400", async () => {
    const res = await request(app).get("/healthz").query({ key: "value" });
    expect(res.statusCode).toEqual(400);
  });
});

const firstName = "Ani";
const lastName = "G";
const strongPassword = "anya@1234";
const email = "anya@young.com";

const createBasicAuth = (username, password) => {
  return "Basic " + Buffer.from(username + ":" + password).toString("base64");
};

const userPath = "/v1/user";
const selfPath = "/self";

describe("Test Case 1", () => {
  it("Account Create", async () => {
    const createUserRequestBody = {
      first_name: firstName,
      last_name: lastName,
      password: strongPassword,
      email: email,
    };
    const accountResponse = await request(app)
      .post(userPath)
      .send(createUserRequestBody);
    expect(accountResponse.statusCode).toEqual(201);

    const getAccountResponse = await request(app)
      .get(userPath + selfPath)
      .set("Authorization", createBasicAuth(email, strongPassword));
    expect(getAccountResponse.statusCode).toEqual(200);
    expect(getAccountResponse.body.first_name).toEqual(firstName);
    expect(getAccountResponse.body.last_name).toEqual(lastName);
    expect(getAccountResponse.body.email).toEqual(email);
  });
});

describe("Test case 2", () => {
  it("Check update", async () => {
    const updateAccount = {
      first_name: "Jack",
      last_name: "Din",
    };
    const updateAccountResponse = await request(app)
      .put(userPath + selfPath)
      .send(updateAccount)
      .set("Authorization", createBasicAuth(email, strongPassword));
    expect(updateAccountResponse.statusCode).toEqual(204);

    const getAccountResponse = await request(app)
      .get(userPath + selfPath)
      .set("Authorization", createBasicAuth(email, strongPassword));
    expect(getAccountResponse.statusCode).toEqual(200);
    expect(getAccountResponse.body.account_created).not.toEqual(
      getAccountResponse.body.account_updated
    );
    expect(getAccountResponse.body.first_name).toEqual(
      updateAccount.first_name
    );
    expect(getAccountResponse.body.last_name).toEqual(
      updateAccount.last_name
    );
    expect(getAccountResponse.body.email).toEqual(email);
  });
});