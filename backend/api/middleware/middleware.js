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

module.exports = {
  checkUserExist,
  encryptPassword
}