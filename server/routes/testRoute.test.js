import request from "supertest";
import mongoose from "mongoose";
// import { app, server } from "../server.js";
// describe("POST /api/tests/save", () => {
//   it("should save a new test and return the test object", async () => {
//     const testData = {
//       user: "John",
//       seconds: 30,
//       words: 100,
//       wpm: 60,
//       raw: 60,
//       language: "English",
//     };

//     const res = await request(app).post("/api/tests/save").send(testData);

//     expect(res.status).toBe(201);
//     expect(res.body.message).toBe("Test saved successfully");
//     expect(res.body.test).toHaveProperty("_id");
//   });

//   afterAll(async () => {
//     await mongoose.connection.close();
//     server.close();
//   });
// });
