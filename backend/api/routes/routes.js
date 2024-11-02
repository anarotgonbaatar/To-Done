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
  generatePasswordToken,
} = require('../middleware/middleware.js');
const { getUserByEmail } = require('../services/services.js');
const apiRoute = Router();

// Get
apiRoute.get('/tasks', verifyToken, getUserTasks);
apiRoute.get('/reset', getUserByEmail, generatePasswordToken);

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
