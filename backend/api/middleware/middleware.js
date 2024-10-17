const User = require('../models/User.js');
const Task = require('../models/Task.js');
const bcrypt = require("bcryptjs")

const checkUserExist = async (req, res, next) => {
  try{
    
      //Check if username is taken.
      await User.findOne({userName: req.body.userName}).then(userDoc => {

        if(userDoc){ 
          //Return back if username is taken
          return res.status(409).json({"status": "Username is already taken"});
        }else{

          //Else go to next middleware function for hashing password
          next();
        }
      })
  }catch(error){
    console.log(error);
  }
}

//Encrypt password and return 
const encryptPassword = async (req, res, next) =>{
  try{
    return bcrypt.hash(req.body.password, 12)
    .then(hashedPassword => {
      const user = new User({
        userName: req.body.userName,
        password: hashedPassword
      })
    
      //Try going to next middleware function for creating user
      req.newUser = user;
      next();
  });

  }catch(err){
    console.log(err);
  }
  
}

const comparePassword = async (req,res,next) =>{
  try{
    const password = req.body.password;
    //Retrieve user by username
    User.findOne({userName: req.body.userName})
    .then( user => {
      console.log(password);
      console.log(user.password)
      bcrypt.compare(password, user.password)
      .then(correct =>{
        if(correct){
          //Password is correct go auth the user
          next()
        }else{
          console.log("Password is incorrect, ending early");
          return res.status(200).json({"status": "Request processed, password is incorrect"})
        }
      })
      .catch(err => {console.log(err)})
    })
  }catch(err){
    console.log(err);
  }
}

const authUser = async (req,res,next) =>{
  try{
    console.log("Inside of authUser")
    res.status(200).json({"status": "Correctly Inside authUser"});
  }catch(err){
    console.log(err)
  }

}

module.exports = {
  checkUserExist,
  encryptPassword,
  comparePassword,
  authUser
}