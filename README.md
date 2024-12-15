# Full-Stack To-Done Application

This is a full-stack web application designed to manage tasks and allow user authentication. It is built with the following technologies:

- **Frontend**: React, CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB

### School Information

- **School**: CSU-Fullerton
- **Course**: Fall 2024 CPSC 449-01
- **Instructor**: Manan Bhargav Shah

### Team Members

1. **Miguel Macias**

   - **Email**: miguel6021857@csu.fullerton.edu

2. **Anar Otgonbaatar**

   - **Email**: anarotgo@csu.fullerton.edu

3. **Junhao Guo**

   - **Email**: jguo1@csu.fullerton.edu

4. **Nhi Danis**

   - **Email**: Ndanis@csu.fullerton.edu

5. **Dylan nguyen**

   - **Email**: scriptingdubbo@csu.fullerton.edu

6. **Brian Yang**

   - **Email**: brianyang@csu.fullerton.edu

7. **Jacob Berry**
   - **Email**: jberry19@csu.fullerton.edu

## Features

- **User Authentication**:
  - User can sign up, log in, and log out.
  - Password reset functionality using an email token.
- **Task Management**:
  - Users can create, update, and delete tasks.
  - Tasks can be marked as completed or incomplete.

## Technology Stack

- **Frontend**:
  - React.js
  - React Router
  - React Icons
- **Backend**:
  - Node.js
  - Express.js
  - MongoDB (via Mongoose)
- **Authentication**:
  - JWT-based authentication

## Prerequisites

Before you begin, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (or MongoDB Atlas)

## Usage

### Authentication

- **Sign Up**: Users can sign up with a username, email, and password.
- **Login**: Users can log in using their username and password.
- **Password Reset**: If a user forgets their password, they can request a password reset via email. A token is sent to the user's email to allow them to reset their password.

### Tasks

- **Create Task**: After logging in, users can create new tasks.
- **View Tasks**: Tasks are displayed in a list, showing the task name and completion status.
- **Edit Tasks**: Users can mark tasks as completed or incomplete.
- **Delete Task**: Users can delete tasks.

### Logout

- Users can log out, which will clear the session and tasks from the frontend.

## API Endpoints

### User Authentication

- `POST /api/signup`: Sign up a new user with a username, email, and password.
- `POST /api/login`: Log in an existing user with username and password.
- `POST /api/resetToken`: Request a password reset token via email.
- `PATCH /api/resetPassword`: Reset the user's password with the provided token.

### Task Management

- `GET /api/tasks`: Get all tasks for the authenticated user.
- `POST /api/tasks`: Create a new task.
- `PATCH /api/tasks/:id`: Update an existing task (mark as complete/incomplete).
- `DELETE /api/tasks/:id`: Delete a task.
