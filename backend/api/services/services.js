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

const getUserByEmail = async (email) => {
  try {
    //Retrieve user by username
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Cannot find user'});
    }

    return user;
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Getting UserByEmail Error' });
  }
};

const getUserByUsername  = async (username) => {
  try {
    //Retrieve user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'Cannot find user'});
    }

    return user;
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Getting getUserByUsername Error' });
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

module.exports = {
  getTaskList,
  createNewTask,
  getUserByEmail,
  getUserByUsername,
};
