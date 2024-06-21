import React from 'react';
import './LoginForm.css';

export const LoginForm = () => {
  return (
    <div className = "box">
        <div className = "LoginContainer">
            <h1 className="LoginInfo"> Login </h1>
            <input className="LoginInfo LoginUser"  type = "text" placeholder = "Username" />
            <input className="LoginInfo LoginUser" type = "text" placeholder ="Password" />
            <button className ="LoginInfo">Login</button>
        </div>
    </div>
  )
}

export default LoginForm