import Task from "../src/models/Task";

const request = require("supertest");
const app = require("../src/app");

const {
  setupDatabase,
  useroneId,
  userOneToken,
  userOne,
  userTwo,
  userTwoId,
  userTwoToken,
  taskOne,
  taskTwo,
  taskThree,
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

// should create task with all information filled
test("should create new task with all information filled", async () => {
  const response = await request(app)
    .post("/api/tasks/create")
    .set("Cookie", `token=${userOneToken}`)
    .send({
      title: "Task 1",
      description: "description of task",
      priority: "low",
      status: "in-progress",
      dueDate: "2021-01-01",
      assignedTo: [useroneId, userTwoId],
      attachments: ["attachment1.pdf", "attachment2.pdf"],
      todos: [
        {
          text: "Todo 1",
          completed: true,
        },
        {
          text: "Todo 2",
          completed: false,
        },
      ],
      progress: 50,
    })
    .expect(201);
});

// should not create user without title
test("should not create new task without title", async () => {
  await request(app)
    .post("/api/tasks/create")
    .set("Cookie", `token=${userOneToken}`)
    .send({
      description: "description of task",
    })
    .expect(400);
});

// should not crete task by a member user
test("should not create new task by a member user", async () => {
  const response = await request(app)
    .post("/api/tasks/create")
    .set("Cookie", `token=${userTwoToken}`)
    .send({
      title: "Task 1",
    })
    .expect(403);
});

// should get all  tasks by admin
test("should get tasks", async () => {
  const response = await request(app)
    .get("/api/tasks")
    .set("Cookie", `token=${userOneToken}`)
    .expect(200);
  expect(200);
  // assert the tasks length is 3
  expect(response.body.tasks.length).toBe(3);
});

// should not get all tasks by member user
test("should not get tasks by memeber user", async () => {
  const response = await request(app)
    .get("/api/tasks")
    .set("Cookie", `token=${userTwoToken}`)
    .expect(403);
  expect(403);
});

// should get tasks assigned to a certain user
test("should get tasks assigned to a certain user", async () => {
  const response = await request(app)
    .get(`/api/tasks/user-tasks`)
    .set("Cookie", `token=${userOneToken}`)
    .expect(200);
  expect(200);
  // assert the tasks length is 2
  expect(response.body.tasks.length).toBe(2);
});

//  should get task by id
test("should get task by id", async () => {
  const response = await request(app)
    .get(`/api/tasks/${taskOne._id}`)
    .set("Cookie", `token=${userOneToken}`)
    .expect(200);

  expect(response.body.task).not.toBeNull();
});

// user admin can also get other users task by id
test("user admin can also get other users task by id", async () => {
  const response = await request(app)
    .get(`/api/tasks/${taskTwo._id}`)
    .set("Cookie", `token=${userOneToken}`)
    .expect(200);

  expect(response.body.task).not.toBeNull();
});

// normal user can get his own task assigned to him or created by him
test("normal user can get his own task assigned to him or created by him", async () => {
  const response = await request(app)
    .get(`/api/tasks/${taskTwo._id}`)
    .set("Cookie", `token=${userTwoToken}`)
    .expect(200);

  expect(response.body.task).not.toBeNull();
});

// normal user cannot get a task that not assigned to him or he
//  is not the creator of the task
test("normal user cannot get a task that not assigned to him or he is not the creator of the task", async () => {
  const response = await request(app)
    .get(`/api/tasks/${taskOne._id}`)
    .set("Cookie", `token=${userTwoToken}`)
    .expect(403);
});

// user admin can update any task and it's information
test("should update task by id", async () => {
  const response = await request(app)
    .put(`/api/tasks/update/${taskOne._id}`)
    .set("Cookie", `token=${userOneToken}`)
    .send({
      title: "Task 1 updated",
    })
    .expect(200);
  const task = await Task.findById(taskOne._id)
  expect(task?.title).toBe("Task 1 updated");
});

// should not update task by a member user
test("should not update task by a member user", async () => {
  const response = await request(app)
    .put(`/api/tasks/update/${taskOne._id}`)
    .set("Cookie", `token=${userTwoToken}`)
    .send({
      title: "Task 1 updated",
    })
    .expect(403);
});

// should delete task by id by the admin
test("should delete task by id by the admin", async () => {
  const response = await request(app)
    .delete(`/api/tasks/delete/${taskOne._id}`)
    .set("Cookie", `token=${userOneToken}`)
    .expect(200);
  const task = await Task.findById(taskOne._id);
  expect(task).toBeNull();
});

// should not delete task by a member user
test("should not delete task by a member user", async () => {
  const response = await request(app)
    .delete(`/api/tasks/delete/${taskOne._id}`)
    .set("Cookie", `token=${userTwoToken}`)
    .expect(403);
});

// should update task status
test("should update task status", async () => {
  const response = await request(app)
    .put(`/api/tasks/${taskOne._id}/status`)
    .set("Cookie", `token=${userOneToken}`)
    .send({
      status: "completed",
    })
    .expect(200);
    // assert the task status is completed
  const task = await Task.findById(taskOne._id);
  expect(task?.status).toBe("completed");
});
