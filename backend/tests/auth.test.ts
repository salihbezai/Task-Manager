
import {
  UpdateRequestBody,
} from "../src/controllers/authController";
import { User } from "../src/models/User";
const request = require("supertest");
const app = require("../src/app");

const { setupDatabase, userOne,useroneId, userOneToken } = require("./fixtures/db");


beforeEach(setupDatabase);


// signup user test
test("should create a new user", async () => {
  const response = await request(app)
    .post("/api/auth/register")
    .send({
      name: "John Doe",
      email: "q5xHd@example.com",
      password: "password123",
    })
    .expect(201);

  // Assert that the user was created
  const user = await User.findById(response.body.user.id);
  expect(user).not.toBeNull();

  // Assertion about the response
  expect(response.body).toMatchObject({
    user: {
      name: "John Doe",
      email: "q5xHd@example.com",
    },
  });

  // Assertion about the password
  expect(user?.password).not.toBe("password123");
  
});

// should not create user with existing email
test("should not create user with existing email", async () => {
  await request(app)
    .post("/api/auth/register")
    .send({
      name: "John Doe",
      email: userOne.email,
      password: "password123",
    })
    .expect(400);
});

// should not create user with wrong invite token
test("should not create user with wrong invite token", async () => {
  await request(app)
    .post("/api/auth/register")
    .send({
      name: "John Doe",
      email: "q5xHd@example.com",
      password: "password123",
      inviteToken: "wrong-token",
    })
    .expect(400);
});

// should create user with a valid invite token
test("should create user admin with a valid invite token", async () => {
  const response = await request(app)
    .post("/api/auth/register")
    .send({
      name: "John Doe",
      email: "q5xHd@example.com",
      password: "password123",
      inviteToken: process.env.ADMIN_INVITE_TOKEN,
    })
    .expect(201);

});

// login user test
test("should login a user", async () => {
  const response = await request(app)
    .post("/api/auth/login")
    .send({
      email: userOne.email,
      password: "mike1234",
    })
    .expect(200);

  expect(response.body.user).not.toBeNull();
});

// should not login user with wrong credentials
test("should not login a user with wrong credentials", async () => {
  await request(app)
    .post("/api/auth/login")
    .send({
      email: userOne.email,
      password: "wrongpassword",
    })
    .expect(401);
});

// should get user profile
test("should get user profile", async () => {
  await request(app)
    .get("/api/auth/me")
    .set("Cookie", `token=${userOneToken}`)
    .expect(200);
});

// should not get user profile without token
test("should not get user profile without token", async () => {
  await request(app).get("/api/auth/me").expect(401);
});

// should update user profile
test("should update user profile", async () => {
  const response = await request(app)
    .put("/api/auth/profile")
    .set("Cookie", `token=${userOneToken}`)
    .send({
      name: "Mike",
      email: "Mike@example.com",
      profileImageUrl: "https://example.com/john.jpg",
    } as UpdateRequestBody)
    .expect(200);

  expect(response.body.user).not.toBeNull();
  // Assertion about the response
  expect(response.body).toMatchObject({
    user: {
      name: "Mike",
      email: "Mike@example.com",
      profileImageUrl: "https://example.com/john.jpg",
    },
  });
});

// should not update user profile without token
test("should not update user profile without token", async () => {
  await request(app)
    .put("/api/auth/profile")
    .send({
      name: "Mike_updated",
      email: "Mike_updated@example.com",
      profileImageUrl: "https://example.com/mike_updated.jpg",
    } as UpdateRequestBody)
    .expect(401);
});




