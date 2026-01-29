
import { User } from "../src/models/User";
const request = require("supertest");
const app = require("../src/app");
const { setupDatabase, userOne,userOneId, userOneToken } = require("./fixtures/db");


beforeEach(setupDatabase);


console.log("user token is "+userOneToken)

// should get users
test("should get users", async () => {
  const response = await request(app)
    .get("/api/users")
    .set("Cookie", `token=${userOneToken}`)
    .expect(200);
  expect(200);
});



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
