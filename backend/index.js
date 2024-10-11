const express = require("express");
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const Task = require('./api/models/Task.js');
const User = require('./api/models/User.js');

// MongoDB connection string (replace <dbname> with your DB name)
const mongoURI = 'mongodb://localhost:27017/todo-app';

// Connect to MongoDB
mongoose.connect( mongoURI, { useNewUrlParser: true, useUnifiedTopology: true } )
    .then ( () => console.log( 'Connected to MongoDB' ) )
    .catch( err => console.error( 'Error connecting to MongoDB' ) );

// Middleware
app.use( cors() );  // Allows requests from React frontend
app.use( express.json() );  // Parses JSON request bodies

// Route
app.get( '/api', ( req, res ) => {
    res.json( { message: 'Backend says hello!' } );
});

// Get all tasks
app.get( '/api/tasks', async ( req, res ) => {
    try {
        const tasks = await Task.find();    // Get all tasks from MongoDB
        res.json( tasks );
    } catch ( error ) {
        res.status( 500 ).json( { message: error.message } );
    }
});
// Create a new tasks
app.post( '/api/tasks', async ( req, res ) => {
    const task = new Task({
        name: req.body.name,
        completed: req.body.completed || false
    });

    try {
        const newTask = await task.save();
        res.status( 201 ).json( newTask );
    } catch ( error ) {
        res.status( 400 ).json( {message: error.message } );
    }
});
// Delete a task
app.delete( 'api/tasks/:id', async ( req, res ) => {
    try {
        const task = await Task.findByIdAndDelete( req.params.id );
        if ( !task ) return res.status( 404 ).json( { message: 'Could not find task' } );
        res.json( { message: 'Deleted task' } );
    } catch ( error ) {
        res.status( 500 ).json( { message: error.message } );
    }
});
// Update a task's completion
app.put( '/api/tasks/:id', async ( req, res ) => {
    try {
        const task = await Task.findById( req.params.id );
        if ( !task ) return res.status( 404 ).json( { message: 'Could not find task' } );

        task.completed = req.body.completed !== undefined ? req.body.completed : task.completed;
        await task.save();
        res.json(task);
    } catch ( error ) {
        res.status( 400 ).json( { message: error.message } );
    }
});

// Post request to create a User
app.post('/api/createUser/', async(req,res,next)=>{
  try{
    const user = new User({
      userName: req.body.userName,
      password: req.body.password
    }

)
  console.log(user.userName + "    " + user.password);
  await user.save();
  res.status(201).send({ message: 'User created successfully'}); 
  res.status(201);
}catch(error){
  console.log(error);
  response.status()
}

})

// Start server
const PORT = process.env.PORT || 4000;
app.listen( PORT, () => {
    console.log('Server is running on port ' + PORT + '.');
})