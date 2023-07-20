import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Homepage } from './pages/Homepage';
import { Login } from './pages/login';
import { EditTaskForm } from './pages/editTasks';
import { AddTaskForm } from './pages/addtasks';
import { AddProjectForm } from './pages/addProject';
import { ProjectPage } from './pages/projectPage';
import { EditProjectForm } from './pages/editProject';

import "./edittask.css"
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
    <Routes>
    <Route index element={<App />} />
      <Route path="login" element={<Login />} />
      <Route path="homepage" element={<Homepage />} />  
      <Route path="/edittask/:id" element={<EditTaskForm />} /> 
      <Route path="/addtask" element={<AddTaskForm />} /> 
      <Route path="/addproject" element={<AddProjectForm />} /> 
      <Route path="/projects" element={<ProjectPage />} /> 
      <Route path="/editproject/:id" element={<EditProjectForm />} /> 
    </Routes>
    </BrowserRouter>
      
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
