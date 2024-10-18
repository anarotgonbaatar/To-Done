const User = require('../models/User.js');
const Task = require('../models/Task.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { getUserByEmail, getTaskList } = require('../services/services.js');

const checkUserExist = async (req, res, next) => {
  try {
    //Check if username is taken.
    await User.findOne({ userName: req.body.userName }).then((userDoc) => {
      if (userDoc) {
        //Return back if username is taken
        return res.status(409).json({ status: 'Username is already taken' });
      } else {
        //Else go to next middleware function for hashing password
        next();
      }
    });
  } catch (err) {
    console.log(err);
  }
};

//Encrypt password and return
const encryptPassword = async (req, res, next) => {
  try {
    return bcrypt.hash(req.body.password, 12).then((hashedPassword) => {
      const user = new User({
        email: req.body.email,
        userName: req.body.userName,
        password: hashedPassword,
      });

      //Try going to next middleware function for creating user
      req.newUser = user;
      next();
    });
  } catch (err) {
    console.log(err);
  }
};

const comparePassword = async (req, res, next) => {
  try {
    const password = req.body.password;
    //Retrieve user by username
    User.findOne({ userName: req.body.userName }).then((user) => {
      //compare password with hashed Password
      bcrypt
        .compare(password, user.password)
        .then((correct) => {
          //Password is correct, prepare to auth the user
          if (correct) {
            const plainObject = user.toObject();
            plainObject._id = plainObject._id.toString();
            delete plainObject.password; //Avoid returning back hashed version of the password
            res.user = plainObject;
            next();
          } else {
            return res
              .status(200)
              .json({ status: 'Request processed, password is incorrect' });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });
  } catch (err) {
    console.log(err);
  }
};

//Logins user and returns a cookie named token for auth
const authUser = async (req, res, next) => {
  try {
    const token = jwt.sign({ id: res.user._id }, process.env.MY_SECRET, {
      expiresIn: '1h',
    });
    res.status(200).cookie('token', token, {
      httpOnly: true,
    });
    res.json({
      Message: 'Should return back token and attach the user Object',
      user: res.user,
    });
  } catch (err) {
    console.log(err);
  }
};

//Grabs cookie token and proceeds to next middleware function
const verifyToken = async (req, res, next) => {
  const token = req.cookies.token;
  try {
    //If token is verified it'll go to next middleware function required.
    const validToken = jwt.verify(token, process.env.MY_SECRET);
    //verify throws an error if wrong, assign ID from token to user
    req.user = validToken.id;
    next();
  } catch (err) {
    //Clear cookie and redirect back to login
    res.clearCookie('token');
    return res.status(404).json({ message: 'Token is not valid.' });
  }
};

module.exports = {
  checkUserExist,
  encryptPassword,
  comparePassword,
  authUser,
  verifyToken,
};
