import request from "supertest";
import app from "../server.js";

describe("POST /api/tests/save", () => {
  it("should save a new test and return the test object", async () => {
    const testData = {
      user: "John",
      seconds: 30,
      words: 100,
      wpm: 60,
      raw: "Hello",
      language: "English",
    };
    const res = await request(app).post("/api/tests/save").send(testData);

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Test saved successfully");
    expect(res.body.test).toHaveProperty("_id");
  });

  //   it("should return 500 if there's an error", async () => {
  //     const res = await request(app).post("/api/tests/save").send({}).expect(500);

  //     expect(res.body.message).toBe("Test saved unsuccessfully");
  //   });
});
