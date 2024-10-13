const { getTaskList, createNewTask, createNewUser } = require("../services/services.js");

// Get Controllers
const getUserTasks = async (req, res) => {
    try {
        //getting list from _id of a user
        const userId = "670b327e9be5e81e0322f35e";
        const tasks = await getTaskList(userId);
        res.status(200).json({ tasks });
    } catch (err) {
        console.log(err)
    }
}


// Post Controllers
const createTask = async (req, res) => {
    try {
        const task = req.body
        await createNewTask(task);
        res.status(200).json({"status": "Task Created Successfully"});
    } catch (err) {
        console.log(err)
    }
};

const createUser = async (req, res) => {
    try {
        const user = req.body;
        await createNewUser(user);
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