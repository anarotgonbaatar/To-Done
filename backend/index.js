const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use( cors() );  // Allows requests from React frontend
app.use( express.json() );  // Parses JSON request bodies

// Route
app.get( '/api', ( req, res ) => {
    res.json( { message: 'Backend says hello!' } );
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen( PORT, () => {
    console.log('Server is running on port 5000.');
})