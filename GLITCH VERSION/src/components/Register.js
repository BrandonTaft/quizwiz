import React, { useState } from 'react'
import '../App.css';
import { NavLink } from "react-router-dom";

function Register(props) {

    const [user, setUser] = useState({})
    const [message, setMessage] = useState('')


    const handleRegisterChange = (e) => {
        setUser({

            ...user,
            [e.target.name]: e.target.value
        })
    }
    const handleRegisterButton = () => {
        
        fetch('https://quiz-wiz-server.glitch.me/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)

        }).then(response => response.json())

            .then(result => {
                if (result.success) {
                    props.history.push('/')
                }


                else {
                    setMessage(result.message)

                }
            })

        
    }
    
    return (
        <div id="register-container">
            <img id="login-title" src="/QuizWizNav3.png" alt="QuizWiz Logotype"/>
            {message && <p>{message}</p>}
            <input className="log-RegText"  type="text" name="userName" onChange={handleRegisterChange} placeholder=" Enter Desired User name"  /><br></br>
            <input className="log-RegText" id="reg-text" type="password" name="password" onChange={handleRegisterChange} placeholder="Enter Desired Password" /><br></br>
            <button className="log-Btn" onClick={handleRegisterButton}>Submit</button>
            <NavLink className='regLink'to="/" >Back to Login</NavLink>
        </div>
    )
}

export default Register