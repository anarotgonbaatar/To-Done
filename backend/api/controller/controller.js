const { getTaskList, createNewTask, checkUserExist } = require("../services/services.js");

// Get Controllers
const getUserTasks = async (req, res) => {
    try {
        //getting list from _id of a user
        const userId = "6708978f737ee2443a406ddf";
        const tasks = await getTaskList(userId);
        res.status(200).json({ tasks });
    } catch (err) {
        console.log(err)
    }
}


// Post Controllers
const createTask = async (req, res) => {
    try {
        console.log(req.body)
        const task = req.body
        createNewTask(req,res, task);
    } catch (err) {
        console.log(err)
    }
};

const createUser = async (req,res) => {
    try {
        newUser = req.newUser;
        await newUser.save();
        res.status(200).json({"status": "User Created Successfully"});
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    getUserTasks,
    createTask,
    createUser
}