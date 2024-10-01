import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
    const [ message, setMessage ] = useState('');
    
    useEffect( () => {
        fetch('http://localhost:5000/api')
            .then( response => response.json() )
            .then( data => setMessage( data.message ) );
    }, [] );

    return (
        <div className='App'>
            <h1>{message}</h1>
        </div>
    );
}

export default App;