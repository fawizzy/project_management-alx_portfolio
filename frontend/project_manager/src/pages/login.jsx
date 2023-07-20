import React, {useState, useEffect} from "react"
import { useNavigate }from "react-router-dom"
import axios from "axios";


export const Login = (props)=>{
    const [email, setEmail] = useState("");
    const [pass, setPassword] = useState("");
    const navigate = useNavigate()

    const addPosts = async (email, password) => {
    axios.defaults.withCredentials = true;  
       

        axios.post('http://127.0.0.1:5000/login', {
            email: email,
            password: password
          },
          { withCredentials: true })
          .then((response)=>{
            localStorage.setItem("session_id", response.data.token)
            console.log(response.status)
            if (response.status === 200){
                navigate("/homepage")
            }
          });
        };
        

    const handleSubmit = (e)=>{
        e.preventDefault()
        
        addPosts(email, pass)
    }
    return (
        <div className="auth-form-container">
        <form className="login-form" onSubmit={handleSubmit} action="" method="post">
            <label htmlFor="email">email</label>
            <input value={email} onChange={(e)=>{setEmail(e.target.value)}} type="email" placeholder="youremail@email.com" id="email" name="email"/>
            <label htmlFor="password">password</label>
            <input value={pass} onChange={(e)=>{setPassword(e.target.value)}} type="password" placeholder="*****" name="password" id="password" />
            <button type="submit">Login</button>
        </form>

        <button className="link-btn" onClick={()=>props.onFormSwitch("register")}>Don't have an account? register here</button>
        </div>
    )
}