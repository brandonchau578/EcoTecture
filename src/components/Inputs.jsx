import React from 'react'
import './Inputs.css'
import { UilSearch, UilLocationPoint} from "@iconscout/react-unicons";


function Inputs() {
  return (
    <div class="search-container">
        <input type="text" class="search-input" placeholder="Enter an address, neighborhood, city, or ZIP code"/>
        <UilSearch 
            className = "UilSearch"
        />
    </div>
  )
}

export default Inputs