const { Router } = require('express');
const {
  getUserTasks,
  createTask,
  deleteTask,
  createUser,
  deleteUser,
} = require('../controller/controller.js');
const {
  checkUserExist,
  encryptPassword,
  comparePassword,
  authUser,
  verifyToken,
} = require('../middleware/middleware.js');
const apiRoute = Router();

// Get
apiRoute.get('/tasks', getUserTasks);

// Post
apiRoute.post('/login', comparePassword, authUser);
apiRoute.post('/tasks', verifyToken, createTask);
apiRoute.post('/createUser', checkUserExist, encryptPassword, createUser);

// Delete
apiRoute.delete('/tasks/:id', verifyToken, deleteTask);
apiRoute.delete('/removeUser/:id', verifyToken, deleteUser);

module.exports = {
  apiRoute,
};
