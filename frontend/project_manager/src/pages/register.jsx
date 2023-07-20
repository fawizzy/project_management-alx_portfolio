import React, {useState} from "react"
import axios from "axios";
import { useNavigate } from "react-router-dom";
import App from "../App";


export const Register = (props)=>{
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");


   
    const navigate = useNavigate()

    const addUser = async (name, email, password) => {
    axios.defaults.withCredentials = true;  
       

        axios.post('http://127.0.0.1:5000/signup', {
            name: name,    
            email: email,
            password: password
          },
          { withCredentials: true })
          .then((response)=>{
            localStorage.setItem("session_id", response.data.token)
            console.log(response.status)
            if (response.status === 201){
                props.onFormSwitch("login")
                
            }
          });
        };
        

    const handleSubmit = (e)=>{
        e.preventDefault()
        
        addUser(name, email, password)
    }
    
   
    return (
        <div className="auth-form-container">
        <form className="registration-form" onSubmit={handleSubmit} action="" method="post">
        <label htmlFor="email">name</label>
            <input value={name} onChange={(e)=>{setName(e.target.value)}} type="text" placeholder="firstname lastname" id="name" name="name"/>
            <label htmlFor="email">email</label>
            <input value={email} onChange={(e)=>{setEmail(e.target.value)}} type="email" placeholder="youremail@email.com" id="email" name="email"/>
            <label htmlFor="password">password</label>
            <input value={password} onChange={(e)=>{setPassword(e.target.value)}} type="password" placeholder="*****" name="password" id="password" />
            <button type="submit">Register</button>
        </form>

        <button className="link-btn" onClick={()=>props.onFormSwitch("login")}>Already have an account? login here</button>
        </div>
    )
}