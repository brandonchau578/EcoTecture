import React from 'react'
import './HomepageBody2.css';
function HomepageBody2() {
  return (
    <div className = "Recomendation-container">
        <div className="Recomendation-box">
            <div className="BoxDescription">
                <h1 className="BoxH1">Rent a home</h1>
                <p>We're creating a seamless online experience - from shopping on the largest rental network, to applying, to paying rent.</p>
                <div className = "BoxButton">Find rentals</div>
            </div>
        </div>
        <div className="Recomendation-box">
            <div className="BoxDescription">
                <h1 className="BoxH1">Browse Homes</h1>
                <p> Find your place with an immersive photo experience and the most listings, includings things you won't find anywhere else.</p>
                <div className = "BoxButton">Browse homes</div>
            </div>
        </div>
        <div className="Recomendation-box">
            <div className = "BoxDescription">
                <h1 className="BoxH1">Sell a home</h1>
                <p>No matter what path you take to sell your home, we can help you navigate a succesful sale.</p>
                <div className = "BoxButton">See your options</div>
            </div>    
        </div>
    </div>
  )
}

export default HomepageBody2