import logo from './logo.svg';
import './App.css';
import { Login } from './pages/login';
import { Register } from './pages/register';
import { Sidebar } from './components/sidebar';
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Homepage from './pages/Homepage';

function App() {
  const [currentForm, setCurrentForm] = useState("login")

  const toggleForm = (formName)=>{
    setCurrentForm(formName)
  }
  return (
    <div className="App">
      {
       currentForm === "login" ? <Login onFormSwitch={toggleForm}/> : <Register onFormSwitch={toggleForm}/>
     }

    </div>
  );
}

export default App;
