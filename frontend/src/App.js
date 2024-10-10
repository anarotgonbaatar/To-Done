import React, { useState, useEffect } from 'react';
import { FaTrash } from 'react-icons/fa';
import './App.css';

function App() {
    const [ tasks, setTasks ] = useState([])

    // Get tasks from backend
    useEffect( () => {
        const getTasks = async () => {
            try {
                const response = await fetch( 'http://localhost:5000/api/tasks' )
                const data = await response.json()
                setTasks( data )
            } catch ( error ) {
                console.error( 'Error getting tasks from backend:', error )
            }
        }
        getTasks();
    })

    const deleteTask = async ( id ) => {
        try {
            await fetch( 'http://localhost:5000/api/tasks/${id}', { method: 'DELETE' } )
            setTasks( tasks.filter( task => task._id !== id ) )
        } catch ( error ) {
            console.error( 'Error deleting task:', error )
        }
    }

    const completeTask = async ( id, completed ) => {
        try {
            await fetch( 'http://localhost:5000/api/tasks/${id}', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify( { completed: !completed } )
            } )
            setTasks( tasks.map( task => task._id !== id ? { ...task, completed: !completed } : task ) )
        } catch ( error ) {
            console.error( 'Error updating task:', error )
        }
    }
    
    return (
        <div className="App">
            {/* Header */}
            <header className='container'>
                <span id='title'>To-Done</span>
            </header>

            <div className='container' id='tasks-container'>
                <span id='header'>Tasks</span>

                {/* Populate with tasks from backend here */}
                { tasks.length > 0 ? (
                    tasks.map( task => (
                        <div key={ task._id } className='task-box'>
                            <input
                                type='checkbox'
                                checked={ task.completed }
                                onChange={ () => completeTask( task._id, task.completed ) }
                            />
                            <span className={ "task-name ${ task.completed ? 'completed' : '' }" }>
                                { task.name }
                            </span>
                            <button onClick={ () => deleteTask( task._id ) }><FaTrash className='icon'/></button>
                        </div>
                    ))
                ) : (
                    <p>No tasks.</p>
                )}
            </div>
        </div>
    );
}

export default App;