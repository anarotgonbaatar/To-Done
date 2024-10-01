import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
    
    return (
        <div className="App">
            {/* Header */}
            <header className='container'>
                <span id='title'>To-Done</span>
            </header>

            <div className='container' id='tasks-container'>
                <span id='header'>Tasks</span>
                {/* Populate with tasks from backend here */}
            </div>
        </div>
    );
}

export default App;