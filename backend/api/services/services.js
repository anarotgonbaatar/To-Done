const Task = require('../models/Task.js');
const User = require('../models/User.js');

// Get Services
const getTaskList = async (userId) => {
  try {
    //Right now we're searching by mongo's _id property
    const userData = await User.findById(userId);
    // .populate('tasks', 'name completed')  // Populate the tasks with only `name` and `completed` fields
    // .exec((err, user) => {
    // if (err) {
    //     return { message: 'Error fetching user tasks' };
    // }

    // //Returns the user's Task collection
    // console.log(user)
    //  return user;
    // });
    const taskArray = [];
    for (const element of userData.tasks) {
      const temp = await Task.findById(element);
      taskArray.push(temp);
    }
    return taskArray;
  } catch (error) {
    console.log(error);
  }
};

// Post Services
const createNewTask = async (req, res, userTask) => {
  try {
    const task = new Task({
      name: userTask.name,
      completed: userTask.completed || false,
    });
    //Save task first, push task into the user's collection
    await task.save();
    const user = await User.findById(req.user);
    user.tasks.push(task._id);
    await user.save();
    return res.status(201).json({ message: 'Created a new task' });
  } catch (err) {
    console.log(err);
    return res.status(404).json({ message: 'Yuh something went wrong' });
  }
};

//getUser by email
const getUserByEmail = async (req, res) => {
  try {
    //Retrieve user by username
    const user = await User.findOne({ email: req.body.email });
    return user;
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  getTaskList,
  createNewTask,
  getUserByEmail,
};
