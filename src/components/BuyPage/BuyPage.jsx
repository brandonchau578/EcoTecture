import React from 'react'
import './BuyPage.css'
import OptionsBar from '../OptionsBar/OptionsBar'




export const BuyPage = () => {
  return <div className = "BuyPage">
    <OptionsBar />
    <div className="BuyBackground">
        <div className = "BuyContainer">
            <h1 id="BuyTitle">Real Estate & Homes for Sale</h1>
        </div>
        
        <div className = "MapContainer"></div>

    </div>
  </div>
}

export default BuyPage