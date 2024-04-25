import React from 'react'
import './Slogan.css';
import irvineSunset from './IrvineSunset.jpeg';
function Slogan() {
  return (
    <div>
      <div className = "slogan">Agents. Tours. Loans. Homes.</div>
      <img src ={irvineSunset} alt="home" className = "homePicture" />
    </div>
  )
}

export default Slogan