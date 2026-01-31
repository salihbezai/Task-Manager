const request = require("supertest");
const app = require("../src/app");

const {
  setupDatabase,
  useroneId,
  userOneToken,
  userOne,
  userTwo,
  userTwoId,
  userTwoToken
} = require("./fixtures/db");

beforeEach(setupDatabase);
// should create new task admin only
test("should create new task admin user", async () => {
  await request(app)
    .post("/api/tasks/create")
    .set("Cookie", `token=${userOneToken}`)
    .send({
      title: "Task 1",
    })
    .expect(201);
});

// should not create user without title
test("should not create new task without title", async () => {
  await request(app)
    .post("/api/tasks/create")
    .set("Cookie", `token=${userOneToken}`)
    .send({
        description: "description of task"
    })
    .expect(400);
});

// should not crete task member user
test("should not create new task by a member user", async () => {
  const response = await request(app)
    .post("/api/tasks/create")
    .set("Cookie", `token=${userTwoToken}`)
    .send({
      title: "Task 1",
    })
    .expect(403);
 
});
