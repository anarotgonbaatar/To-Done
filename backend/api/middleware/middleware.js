const User = require('../models/User.js');
const Task = require('../models/Task.js');

const checkUserExist = async (req, res, next) => {
  try{
      const user = new User({
        userName: req.body.userName,
        password: req.body.password
      }
  )

      //Check if username is taken.
      await User.findOne({userName: user.userName}).then(userDoc => {

        if(userDoc){ 
          //Return back if username is taken
          return res.status(409).json({"status": "Username is already taken"});
        }else{

          //Else go to next middleware function
          req.newUser = user;
          console.log(req.newUser);
          next();
        }
      })
  }catch(error){
    console.log(error);
  }
}

module.exports = {
  checkUserExist
}