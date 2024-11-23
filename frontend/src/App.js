// States for tasks and authentication
import React, { useState, useEffect } from 'react';
import { FaTeeth, FaTrash } from 'react-icons/fa';
import './App.css';
import { IoMdClose } from 'react-icons/io';
import { useLocation, useSearchParams, useNavigate } from 'react-router-dom';

function App() {
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null); // No user at first
  const [activeTab, setActiveTab] = useState('signin');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetTokenVisible, setResetTokenVisible] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [containerVisible, setContainerVisible] = useState('');
  const [resetPasswordVisible, setResetPassowrdVisible] = useState('');
  let location = useLocation();
  let [params] = useSearchParams();
  let navigate = useNavigate();

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
          });
          const data = await response.json();
          setTasks(data.tasks);
        } catch (error) {
          console.error('Error getting tasks from backend: ', error);
        }
      };
      getTasks();
    } else {
      setTasks([]); // Clear tasks when user is logged out
      console.log('Tasks: ', tasks);
      console.log('User: ', user);
    }
  }, [user]);

  useEffect(() => {
    if (location.pathname === '/reset-password') {
      try {
        setContainerVisible(true);
        setResetPassowrdVisible(true);
      } catch (error) {
        console.log('Error:', error);
      }
    }
  }, [location.pathname]); //Makes sure to have the HTML load before checking for change

  //Request a reset password token with the use of the user's email.
  async function requestToken() {
    try {
      const response = await fetch('http://localhost:5000/api/resetToken', {
        mode: 'cors',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email }),
      });

      //Email is valid, now make other textfields appear
      if (response.status === 200) {
        //Toggle aditional text-fields for reset token and new password

        setMessage('Check email for your password reset token!');
        setStatus('success');
      } else if (response.status === 404) {
        setMessage('Email was not found. Please try again.');
        setStatus('error');
      }
    } catch (error) {}
  }

  function RenderMessage({ message, status }) {
    return <span className={`status-message ${status}`}> {message} </span>;
  }

  async function resetPassword() {
    try {
      //Make sure the user has inserted the same password twice
      const token = params.get('token');
      console.log('This is token:', token);
      if (newPassword === confirmPassword) {
        const response = await fetch(
          'http://localhost:5000/api/resetPassword',
          {
            mode: 'cors',
            method: 'PATCH',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              resetToken: token,
              newPassword: newPassword,
            }),
          },
        );

        if (response.status === 200) {
          setMessage('Password reset correctly. You will be redirected soon.');
          setStatus('success');
          await setTimeout(() => {
            setContainerVisible(false);
            setResetPassowrdVisible(false);

            navigate('/');
          }, 3000);
        } else {
          setMessage('Error occured while trying to reset password.');
          setStatus('error');
        }
      } else {
        setMessage('Passwords do not match.');
        setStatus('error');
      }
    } catch (error) {
      console.log('Error:', error);
    }
  }
  // Sign up function
  const handleSignup = (e) => {
    // ...
  };

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
      if (response.status === 200) {
        const data = await response.json();
        setUser(data);
      } else {
        setUser(null); // Reset user on failed login
        setTasks([]);
      }
    } catch (err) {
      console.log('Error while attempting to login', err);
    }

    console.log(user);
  };

  const handleLogout = () => {
    console.log('Before logout - tasks:', tasks);

    // Clear user and tasks
    setUser(null);
    setTasks([]);

    console.log('After logout - tasks should be empty:', tasks);
  };

  const deleteTask = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      setTasks(tasks.filter((tasks) => tasks._id !== id));
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
                  class="text-field"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <input
                  type="password"
                  class="text-field"
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
                  class="text-field"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <input
                  type="email"
                  class="text-field"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <input
                  type="password"
                  class="text-field"
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
        {/*Reset password option is only there when not logged in*/}
        {!user && (
          <form>
            <span>
              Forgot your password?
              <button
                type="button"
                className="btn"
                onClick={() => {
                  setContainerVisible(true);
                  setResetTokenVisible(true);
                }}
              >
                Reset Password
              </button>
            </span>
            <div
              className={`overlay-container ${containerVisible ? 'visible' : ''} `}
            >
              {resetTokenVisible && (
                <div className="popout-box">
                  <button
                    type="button"
                    className="exit-button"
                    onClick={() => {
                      setContainerVisible(false);
                      setResetTokenVisible(false);
                    }}
                  >
                    <IoMdClose />
                  </button>
                  <span>Insert your email for a password reset</span>
                  <input
                    type="email"
                    className="text-field"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn"
                    id="reset-token-button"
                    onClick={requestToken}
                  >
                    Request Token
                  </button>
                  {<RenderMessage message={message} status={status} />}
                </div>
              )}
              {resetPasswordVisible && (
                <div className="popout-box">
                  <button
                    type="button"
                    className="exit-button"
                    onClick={() => {
                      setContainerVisible(false);
                      setResetPassowrdVisible(false);
                    }}
                  >
                    <IoMdClose />
                  </button>
                  <span className="popout-box-text">Reset your password</span>
                  <input
                    type="password"
                    className="text-field"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <input
                    type="password"
                    className="text-field"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button type="button" className="btn" onClick={resetPassword}>
                    Reset Your Password
                  </button>
                  {<RenderMessage message={message} status={status} />}
                </div>
              )}
            </div>
          </form>
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
