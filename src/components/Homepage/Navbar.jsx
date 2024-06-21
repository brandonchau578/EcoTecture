import React from 'react';
import './Navbar.css';
import {FaSearch} from "react-icons/fa"
import { useNavigate } from 'react-router-dom';
function showSidebar(e){
    e.preventDefault()
    const sidebar = document.querySelector('.sidebar')
    sidebar.style.display='flex'
}

function hideSidebar(e){
    e.preventDefault()
    const sidebar = document.querySelector('.sidebar')
    sidebar.style.display='none'
}
function Navbar() {
  return (
    <div className = "homepage">
        <nav>
            <ul className = "sidebar">
                <li onClick={hideSidebar}>
                    <a href="/">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg>                </a>
                </li>
                <li><a href="/Buy">Buy</a></li>
                <li><a href="/Rent">Rent</a></li>
                <li><a href="/Sell">Sell</a></li>
                <li><a href="/Help">Help</a></li>
                <li><a href="/Login">Sign In</a></li>
            </ul>
            <ul>
                <li><a href="/">EcoTecture</a></li>
                <li className="hideOnMobile"><a href="/Buy">Buy</a></li>
                <li className="hideOnMobile"><a href="/Rent">Rent</a></li>
                <li className="hideOnMobile"><a href="/Sell">Sell</a></li>
                <li className="hideOnMobile"><a href="/Help">Help</a></li>
                <li className="hideOnMobile"><a href="/Login">Sign In</a></li>
                <li className="menu-button"onClick={showSidebar}>
                    <a href="#"><svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg>
                    </a>
                </li>     
            </ul>
        </nav>
    </div>
  )
}

export default Navbar