const mongoose = require('mongoose');
const Task = require('./Task');

//User will own an array of Tasks that are also a mongodb schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  resetToken: String,
  restTokenExpiration: Date,
  userName: { type: String, required: true },
  password: { type: String, required: true },
  tasks: [{ type: mongoose.Types.ObjectId, ref: 'Task' }],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
