import React from 'react';
import './LoginForm.css';

export const LoginForm = () => {
  return (
    <div className = "box">
        <div className = "LoginContainer">
            <h1 className="LoginInfo"> Welcome to Ecotecture </h1>
            <h2 className ="LoginHeader"> Email</h2>
            <input className="LoginInfo LoginUser"  type = "text" placeholder = "Enter Email" />
            <h2 className = "LoginHeader"> Password</h2>
            <input className="LoginInfo LoginUser" type = "password" placeholder ="Enter Password" />
            <div className = "LoginInfo SignedInContainer">
              <input className = "SignedIn"  id="signedIn" type="checkbox"/>
              <label for="signedIn"> Keep me signed in</label>
            </div>
            <button className ="LoginInfo">Sign In</button>
        </div>
        
    </div>
  )
}

export default LoginForm