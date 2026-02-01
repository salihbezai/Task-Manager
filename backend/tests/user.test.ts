
import { User } from "../src/models/User";
const request = require("supertest");
const app = require("../src/app");
const { setupDatabase, userOne,userOneId, userOneToken } = require("./fixtures/db");


beforeEach(setupDatabase);




// should get users
test("should get users", async () => {
  const response = await request(app)
    .get("/api/users")
    .set("Cookie", `token=${userOneToken}`)
    .expect(200);
  expect(200);
});

// should get user by id 
test("should get user by id", async () => {
  const response = await request(app)
    .get(`/api/users/${userOneId}`)
    .set("Cookie", `token=${userOneToken}`)
    .expect(200);

  expect(response.body.user).not.toBeNull();
})

// router.delete("/delete/:id", protect, adminOnly, deleteUserById);
// should delete user by id (admin only)
test("should delete user by id (admin only)", async () => {
  const response = await request(app)
    .delete(`/api/users/delete/${userOneId}`)
    .set("Cookie", `token=${userOneToken}`)
    .expect(200);
    // assert that the user was deleted
    const user = await User.findById(userOneId);
    expect(user).toBeNull();
})

// upload image profile
test("should upload image profile", async () => {
  const response = await request(app)
    .post("/api/users/upload-image")
    .set("Cookie", `token=${userOneToken}`)
    .attach("image", "tests/fixtures/Mike.jpg")
    .expect(200);

  expect(response.body.imageUrl).not.toBeNull();
  expect(response.body.imageUrl).toEqual(expect.any(String));

  // assert that the image was saved to the database
  const user = await User.findById(userOneId);
  expect(user?.profileImageUrl).toBe(response.body.imageUrl);
});
