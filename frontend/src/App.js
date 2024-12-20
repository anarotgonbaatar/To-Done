// States for tasks and authentication
import React, { useState, useEffect } from 'react';
import { FaTeeth, FaTrash, FaCheckCircle } from 'react-icons/fa';
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

  const backendURL = process.env.REACT_APP_BACKEND_URL;
  //New task
  const [newTask, setNewTask] = useState('');
  const [newTaskBool, setNewTaskBool] = useState(false);

  // Get tasks from backend WHEN user is logged in
  useEffect(() => {
    if (user) {
      const getTasks = async () => {
        try {
          console.log('GET From api/task');
          const response = await fetch(`${backendURL}/api/tasks`, {
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
      const response = await fetch(`${backendURL}/api/resetToken`, {
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
        const response = await fetch(`${backendURL}/api/resetPassword`, {
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
        });

        if (response.status === 200) {
          setMessage('Password reset correctly. You will be redirected soon.');
          setStatus('success');
          await setTimeout(() => {
            setContainerVisible(false);
            setResetPassowrdVisible(false);
            setMessage(null);
            setStatus(null);
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
  const handleSignup = async (e) => {
    e.preventDefault();
    const data = {
      email: email,
      username: username,
      password: password,
    };
    try {
      const res = await fetch(`${backendURL}/api/createUser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (res.status == 200) {
        setMessage('User created sucessfully');
        setStatus('success');
      } else if (res.status == 409) {
        const data = await res.json();
        setMessage(data.status);
        setStatus('error');
      }
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  // Login function
  const handleLogin = async (e) => {
    // ...
    e.preventDefault(); // This single line was all I needed for it to work....
    try {
      console.log('Attempting POST request');
      const response = await fetch(`${backendURL}/api/login`, {
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
        setMessage(null);
        setStatus(null);
      } else if (response.status === 401 || response.status === 400) {
        setMessage('Incorrect Username/Password. Please try agan.');
        setStatus('error');
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

  const handleCreateTask = async (e) => {
    e.preventDefault();
    const data = {
      name: newTask,
      completed: newTaskBool,
    };
    try {
      const res = await fetch(`${backendURL}/api/tasks`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const response = await fetch(`${backendURL}/api/tasks`, {
        mode: 'cors',
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const tasksJSON = await response.json();
      setTasks(tasksJSON.tasks);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await fetch(`${backendURL}/api/tasks/${id}`, {
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
      await fetch(`${backendURL}/api/tasks/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !completed }),
      });
      setTasks(
        tasks.map((task) =>
          task._id !== id ? { ...task, completed: !completed } : task,
        ),
      );
      setTasks(tasks.filter((tasks) => tasks._id !== id));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  return (
    <div className="App">
      {/* Header */}
      <div className="login-title" id="title">
        To-Done
      </div>
      <header className="login-container" id="header">
        {/* Conditional visibility */}
        {user ? (
          <div className="auth-section">
            <span>Welcome, {username}</span>
            <button onClick={handleLogout} className="btn" id="logout-btn">
              Logout
            </button>
            {/* Creating Tasks Section */}
            <form onSubmit={handleCreateTask}>
              <input
                type="text"
                class="text-field"
                placeholder="New Task"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                required
              />

              <button type="submit" className="btn">
                Create Task
              </button>
            </form>
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
                {<RenderMessage message={message} status={status} />}
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
                  Sign Up
                </button>
                {<RenderMessage message={message} status={status} />}
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
                      setMessage(null);
                      setStatus(null);
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
          {tasks.length >= 0 ? (
            tasks.map((task) => (
              <div key={task._id} className="task-box">
                <button onClick={() => completeTask(task._id, task.completed)}>
                  <FaCheckCircle className="icon" />
                </button>
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
            <p style={{ marginTop: '10px' }}>No tasks.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
