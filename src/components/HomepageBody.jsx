import React from 'react'
import './HomepageBody.css';
function HomepageBody() {
  return (

    <div className = "body">
        <div className = "suggestion-container">
            <h1> Trending Homes in Irvine, CA</h1>
            <p> Viewed and saved the most in the area over the past 24 hours</p>
        </div>
        <div className = "SuggetionWheel">
            <div className = "SuggestionBox">1</div>
            <div className = "SuggestionBox">2</div>
            <div className = "SuggestionBox">3</div>
            <div className = "SuggestionBox">4</div>
            <div className = "SuggestionBox">5</div>
            <div className = "SuggestionBox">6</div>

        </div>
    </div>
  )
}

export default HomepageBody