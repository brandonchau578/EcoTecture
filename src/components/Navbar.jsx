import React from 'react';
import './Navbar.css';

function Navbar() {
  return (
    <div className = "Navbar">
        <div className = "Title">
            EcoTecture
        </div>
        <div className = "NavButton">
            <div className = "LeftNavButton">
                <span className = "Home"> Home</span>
                <span className = "About"> About</span>
                <span className = "Buy"> Buy</span>
                <span className = "Rent"> Rent</span>
                <span className = "Sell"> Sell</span>
                <span className = "Help"> Help</span>
            </div>
            <div className = "RightNavButton">
                <span> Sign In</span>
            </div>
        </div>

    </div>
  )
}

export default Navbar