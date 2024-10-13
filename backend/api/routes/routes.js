const { Router } = require("express");
const { getUserTasks, createTask, createUser } = require("../controller/controller.js");

const apiRoute = Router();

// Get
apiRoute.get("/tasks", getUserTasks)

// Post
apiRoute.post("/tasks", createTask);
apiRoute.post("/createUser", createUser);

module.exports = {
    apiRoute
}