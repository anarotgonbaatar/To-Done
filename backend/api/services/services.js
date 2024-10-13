const Task = require('../models/Task.js');
const User = require('../models/User.js');

// Get Services
const getTaskList = async (userId) => {
    try {

        //Right now we're searching by mongo's _id property
        const userData = await User.findById(userId)
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
            const temp = await Task.findById(element)
            taskArray.push(temp);
        }
        return taskArray;
      } catch ( error ) {
          console.log(error)
      }
}

// Post Services
const createNewTask = async (userTask) => {
    try {
        const task = new Task({
            name: userTask.name,
            completed: userTask.completed || false
        });
        //Save task first, push task into the user's collection
      await task.save();
      const user = await User.findById("670b327e9be5e81e0322f35e");
      user.tasks.push(task._id);
      await user.save();

    } catch ( err ) {
        console.log(err);
    }
}

const createNewUser = async (userInfo) => {
    try{
        const user = new User({
          userName: userInfo.userName,
          password: userInfo.password
        }
    
    )
      console.log(user.userName + "    " + user.password);
      await user.save();
    }catch(error){
      console.log(error);
    }
}

module.exports = {
    getTaskList,
    createNewTask,
    createNewUser
}