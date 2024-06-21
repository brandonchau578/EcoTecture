import React from 'react'
import HomepageBody from './HomepageBody.jsx';
import Navbar from './Navbar.jsx';
import SloganSearchBar from './SloganSearchBar.jsx';
import HomepageBody2 from './HomepageBody2.jsx';

function Homepage(){ 
  return (
    <div className = "HomePage">
        <SloganSearchBar />
        <HomepageBody />
        <HomepageBody2 />
    </div>
  )
}

export default Homepage