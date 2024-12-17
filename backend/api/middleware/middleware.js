const User = require('../models/User.js');
const Task = require('../models/Task.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const sendGridTransport = require('nodemailer-sendgrid-transport');
const crypto = require('crypto');
require('dotenv').config();

//Define our Sendgrid transporter
const transporter = nodemailer.createTransport(
  sendGridTransport({
    auth: {
      api_key: process.env.SEND_GRID_API_KEY,
    },
  })
);
const { getUserByEmail, getTaskList } = require('../services/services.js');

const checkUserExist = async (req, res, next) => {
  try {
    //Check if username is taken.
    await User.findOne({ username: req.body.username }).then((userDoc) => {
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
        username: req.body.username,
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
    User.findOne({ username: req.body.username }).then((user) => {
      //First check if we get returned back a null value meaning user does not exit
      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }
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
              .status(401)
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
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
    });

    //Return back User object with token and taskID's
    res.status(200).json({
      user: res.user,
      message: 'user Auth sucessfully',
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

//Generates a password token to be emailed
const generatePasswordToken = async (req, res, next) => {
  try {
    const user = await getUserByEmail(res, req.body.email);

    if (user) {
      crypto.randomBytes(24, async (err, buff) => {
        if (err) {
          console.log(err);
        } else if (buff) {
          //Assign the random bytes as token and have it be a valid token for 1hr
          const token = buff.toString('hex');
          user.resetToken = token;
          user.resetTokenExpiration = Date.now() + 3600000;
          await user.save();
          req.user = user; //To be used in next function
          next();
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
};

//Handles sending the email to the user with their valid reset token
const emailToken = async (req, res) => {
  return transporter
    .sendMail({
      to: req.user.email,
      from: process.env.SENDER_EMAIL,
      subject: 'Password Reset Token',
      html: `<h1>Here is your password reset token http://localhost:3000/reset-password?token=${req.user.resetToken}</h1>`,
    })
    .then((result) => {
      return res.status(200).json({ message: result });
    })
    .catch((error) => {
      console.error(error);
      return res
        .status(500)
        .json({ message: 'Internal error while sending email.' });
    });
};

const compareToken = async (req, res, next) => {
  console.log('Requestrecieved inside compare token');
  try {
    const user = await User.findOne({ resetToken: req.body.resetToken });
    console.log(user);
    if (user) {
      //If user is valid and token is valid
      console.log('Before validating token expiration');
      console.log(Date.now());
      console.log(user.resetTokenExpiration);
      if (Date.now() < user.resetTokenExpiration) {
        //Move onto controller to update mongodb
        console.log('Token is valid');
        req.user = user;
        next();
      }
    } else if (!user) {
      return res.status(404).json({ message: 'User is not found' });
    } else {
      return res.status(500).json({ message: 'Internal Error.' });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  checkUserExist,
  encryptPassword,
  comparePassword,
  authUser,
  verifyToken,
  generatePasswordToken,
  emailToken,
  compareToken,
};
