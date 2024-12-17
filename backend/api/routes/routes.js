const { Router } = require('express');
const {
  getUserTasks,
  createTask,
  deleteTask,
  createUser,
  deleteUser,
  resetPassword,
} = require('../controller/controller.js');
const {
  checkUserExist,
  encryptPassword,
  comparePassword,
  authUser,
  verifyToken,
  generatePasswordToken,
  emailToken,
  compareToken,
  verifyResetToken,
} = require('../middleware/middleware.js');
const { getUserByEmail } = require('../services/services.js');
const apiRoute = Router();

// Get
apiRoute.get('/tasks', verifyToken, getUserTasks);

// Post
apiRoute.post('/login', comparePassword, authUser);
apiRoute.post('/tasks', verifyToken, createTask);
apiRoute.post('/createUser', checkUserExist, encryptPassword, createUser);
apiRoute.post('/resetToken', generatePasswordToken, emailToken);

//Patch
apiRoute.patch('/resetPassword', compareToken, resetPassword);

// Delete
apiRoute.delete('/tasks/:id', verifyToken, deleteTask);
apiRoute.delete('/removeUser/:id', verifyResetToken, deleteUser);

module.exports = {
  apiRoute,
};
