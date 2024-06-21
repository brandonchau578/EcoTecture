import React from 'react';
import './Navbar.css';
import {FaSearch} from "react-icons/fa"
function showSidebar(){
    const sidebar = document.querySelector('.sidebar')
    sidebar.style.display='flex'
}

function hideSidebar(){
    const sidebar = document.querySelector('.sidebar')
    sidebar.style.display='none'
}
function Navbar() {
  return (
    <div className = "homepage">
        <nav>
            <ul className = "sidebar">
                <li onClick={hideSidebar}>
                    <a href="#">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg>                </a>
                </li>
                <li><a href="#">Buy</a></li>
                <li><a href="#">Rent</a></li>
                <li><a href="#">Sell</a></li>
                <li><a href="#">Help</a></li>
                <li><a href="#">Sign In</a></li>
            </ul>
            <ul>
                <li><a href="#">EcoTecture</a></li>
                <li class="hideOnMobile"><a href="#">Buy</a></li>
                <li class="hideOnMobile"><a href="#">Rent</a></li>
                <li class="hideOnMobile"><a href="#">Sell</a></li>
                <li class="hideOnMobile"><a href="#">Help</a></li>
                <li class="hideOnMobile"><a href="#">Sign In</a></li>
                <li class="menu-button"onClick={showSidebar}>
                    <a href="#"><svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg>
                    </a>
                </li>     
            </ul>
        </nav>
    </div>
  )
}

export default Navbar