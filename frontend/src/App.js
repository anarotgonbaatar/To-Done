import React, { useState, useEffect } from 'react';
import { FaTrash } from 'react-icons/fa';
import './App.css';

function App() {
  // States for tasks and authentication
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null); // No user at first
  const [activeTab, setActiveTab] = useState('signin');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Get tasks from backend WHEN user is logged in
  useEffect(() => {
    if (user) {
      const getTasks = async () => {
        try {
          const response = await fetch('http://localhost:5000/api/tasks', {
            mode: 'cors',
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            //body: JSON.stringify({ username: username, password: password }),
          });
          const data = await response.json();
          setTasks(data);
        } catch (error) {
          console.error('Error getting tasks from backend: ', error);
        }
      };
      getTasks();
    }
  }, [user]); // Only run when 'user' changes

  // Sign up function
  const handleSignup = (e) => {
    // ...
  };

  const controller = new AbortController();
  const signal = controller.signal;
  // Login function
  const handleLogin = async (e) => {
    // ...
    e.preventDefault(); // This single line was all I needed for it to work....
    try {
      console.log('Attempting POST request');
      const response = await fetch('http://localhost:5000/api/login', {
        mode: 'cors',
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username, password: password }),
      });
      const data = await response.json();
      setUser(data);
    } catch (err) {
      console.log('Error while attempting to login', err);
    }
  };

  // Logout function
  const handleLogout = () => {
    setUser(null);
    setTasks([]);
  };

  const deleteTask = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: 'DELETE',
      });
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const completeTask = async (id, completed) => {
    try {
      await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !completed }),
      });
      setTasks(
        tasks.map((task) =>
          task._id !== id ? { ...task, completed: !completed } : task,
        ),
      );
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  return (
    <div className="App">
      {/* Header */}
      <header className="container" id="header">
        <span id="title">To-Done</span>

        {/* Conditional visibility */}
        {user ? (
          <div className="auth-section">
            <span>Welcome, {user.username}</span>
            <button onClick={handleLogout} className="btn" id="logout-btn">
              Logout
            </button>
          </div>
        ) : (
          <div className="auth-section">
            {/* Tabs for Sign In and Sign Up */}
            <div className="tabs">
              <button
                className={activeTab === 'signin' ? 'active' : ''}
                onClick={() => setActiveTab('signin')}
              >
                Sign In
              </button>
              <button
                className={activeTab === 'signup' ? 'active' : ''}
                onClick={() => setActiveTab('signup')}
              >
                Sign Up
              </button>
            </div>

            {/* Authentication form */}
            {activeTab === 'signin' ? (
              <form onSubmit={handleLogin}>
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span>Don't have an account? Sign Up</span>
                <button type="submit" className="btn">
                  Sign In
                </button>
              </form>
            ) : (
              <form onSubmit={handleSignup}>
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span>Already have an account? Sign In</span>
                <button type="submit" className="btn">
                  Sign In
                </button>
              </form>
            )}
          </div>
        )}
      </header>

      {/* Tasks only show up when user is logged in */}
      {user && (
        <div className="container" id="tasks-container">
          <span>Tasks</span>

          {/* Populate with tasks from backend here */}
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <div key={task._id} className="task-box">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => completeTask(task._id, task.completed)}
                />
                <span
                  className={`task-name ${task.completed ? 'completed' : ''}`}
                >
                  {task.name}
                </span>
                <button onClick={() => deleteTask(task._id)}>
                  <FaTrash className="icon" />
                </button>
              </div>
            ))
          ) : (
            <p>No tasks.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
