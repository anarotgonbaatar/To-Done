const { Router } = require("express");
const { getUserTasks, createTask, createUser } = require("../controller/controller.js");
const { checkUserExist, encryptPassword, comparePassword, authUser } = require("../middleware/middleware.js")
const apiRoute = Router();

// Get
apiRoute.get("/tasks", getUserTasks);
apiRoute.get("/login", comparePassword, authUser);

// Post
apiRoute.post("/tasks", createTask);
apiRoute.post("/createUser", checkUserExist, encryptPassword, createUser);

module.exports = {
    apiRoute
}