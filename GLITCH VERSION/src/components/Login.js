
import React, { useState } from 'react';
import { NavLink } from "react-router-dom";
import '../App.css';
import googleLogo from './google2.png';
import facebookLogo from './facebook.png';
import githubLogo from './github.png';
function Login(props) {


    const [credentials, setCredentials] = useState({})
    const [message, setMessage] = useState('')


    const handleLoginChange = (e) => {
        setCredentials({

            ...credentials,
            [e.target.name]: e.target.value
        })
    }

    const handleLoginButton = () => {
       
        fetch('https://quiz-wiz-server.glitch.me/api/login',{
            method: 'POST',
            origin: '*',
            headers: {
                
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)

        }).then(response => response.json())
            .then(result => {
                if (result.success == true) {
                    console.log(result)
                    //Get Token And Put It In Local Storage
                    const token = result.token
                    localStorage.setItem('jsonwebtoken', token)
                    localStorage.setItem('user_Id', result.user_id)
                    localStorage.setItem('name', result.name)
                    props.history.push('profile/'+result.name)

                }
                else {
                    setMessage(result.message)
                }
            })
    }



    return (
        <div id="logBody">
           
            <img id="login-title" src="/QuizWizNav3.png" alt="QuizWiz Logotype"/>
            <div id="login-Container">
                
                <input className="log-RegText" type="text" name="username" onChange={handleLoginChange} placeholder="User name" /><br></br>
                <input className="log-RegText" type="password" name="password" onChange={handleLoginChange} placeholder="Password" /><br></br>
                {message && <p className="message" >{message}</p>}
                <a className="log-Btn" onClick={handleLoginButton}>Login</a>
            </div>
            
            <div className="icon-container" style={{ textAlign: "center" }}>

            <NavLink to="/register" className='regLink'>Register Here</NavLink>

                <a id="google-btn" href="https://quiz-wiz-server.glitch.me/auth/google">
                <a href="https://quiz-wiz-server.glitch.me/auth/google">
                    <img id="icon" src={googleLogo} alt="Login With Google"  style={{ backgroundColor: "#CB4024" }}></img>
                </a>
                <div id="google">Login With Google</div>
                </a>
                

                
                <a id="facebook-btn" href="https://quiz-wiz-server.glitch.me/auth/facebook">
                <a href="https://quiz-wiz-server.glitch.me/auth/facebook">
                    <img id="icon" src={facebookLogo} alt="Login With Facebook"  style={{ backgroundColor: "#4168bb" }}></img>
                </a>
                <div id="facebook">Login With Facebook</div>
                </a>

                <a id="github-btn" href="https://quiz-wiz-server.glitch.me/auth/github">
                <a href="https://quiz-wiz-server.glitch.me/auth/github">
                    <img id="icon" src={githubLogo} alt="Login With Github"  style={{ backgroundColor: "#000" }}></img>
                </a>
                <div id="github">Login With Github</div>
                </a>
            </div>
        </div>
    )
}



export default Login