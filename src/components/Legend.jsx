// Legend.js component

import React from 'react';
import './Legend.css';

const Legend = ({ showAirQuality }) => {
  return (
    <div className="legend">
      <h4>Map Legend</h4>
      
      {/* Basic legend items */}
      <div className="legend-item">
        <span className="legend-icon marker-green"></span>
        <span>Your Location</span>
      </div>
      
      <div className="legend-item">
        <span className="legend-icon marker-red"></span>
        <span>Superfund Site</span>
      </div>
      
      <div className="legend-item">
        <span className="legend-icon marker-orange"></span>
        <span>Toxic Release Inventory Site</span>
      </div>
      
      <div className="legend-item">
        <span className="legend-icon marker-grey"></span>
        <span>Other Environmental Hazard</span>
      </div>
      
      <div className="legend-item">
        <span className="legend-icon circle-blue"></span>
        <span>3 Mile Radius</span>
      </div>
      
      {/* Distance impact indicators */}
      <h4 className="legend-subtitle">Impact Level</h4>
      
      <div className="legend-item">
        <span className="legend-icon bar-red"></span>
        <span>Significant Impact ({'<'} 2km)</span>
      </div>
      
      <div className="legend-item">
        <span className="legend-icon bar-yellow"></span>
        <span>Moderate Impact (2-5km)</span>
      </div>
      
      <div className="legend-item">
        <span className="legend-icon bar-green"></span>
        <span>Minimal Impact ({'<'} 5km)</span>
      </div>
      
      {/* Air quality legend (conditional) */}
      {showAirQuality && (
        <>
          <h4 className="legend-subtitle">Air Quality</h4>
          
          <div className="legend-item">
            <span className="legend-icon circle-green"></span>
            <span>Excellent (AQI 9-10)</span>
          </div>
          
          <div className="legend-item">
            <span className="legend-icon circle-yellow"></span>
            <span>Good (AQI 7-8)</span>
          </div>
          
          <div className="legend-item">
            <span className="legend-icon circle-orange"></span>
            <span>Moderate (AQI 5-6)</span>
          </div>
          
          <div className="legend-item">
            <span className="legend-icon circle-red"></span>
            <span>Unhealthy (AQI 3-4)</span>
          </div>
          
          <div className="legend-item">
            <span className="legend-icon circle-maroon"></span>
            <span>Very Unhealthy (AQI 1-2)</span>
          </div>
        </>
      )}
      
      {/* Data source information */}
      <div className="legend-footer">
        <p>Data sources: EPA Envirofacts API, OpenWeatherMap</p>
      </div>
    </div>
  );
};

export default Legend;