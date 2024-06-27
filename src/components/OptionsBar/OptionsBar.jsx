import React from 'react'
import './OptionsBar.css'
import { UilSearch } from '@iconscout/react-unicons'

function OptionsBar() {
  return (
    <div className = "OptionsBar">
        <div className = "SearchBarContainer">
            <input className = "SearchBar" type="search" placeholder='City, Neighborhood, ZIP, Address' results/>
            <span className="SearchIcon"><UilSearch/></span>
        </div>
    </div>
  )
}

export default OptionsBar