import React, { useState, useCallback, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Circle, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import './App.css';
import ScoringBox from './components/ScoringBox';
import Legend from './components/Legend';
import Navbar from './components/Navbar';

// Haversine formula to calculate distance between two lat/lng points
const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  return distance;
};

// Green marker for user's location
const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Red marker for Superfund sites (high risk)
const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Orange marker for TRI sites (medium risk)
const orangeIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Grey marker for placeholder/generic hazards
const greyIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const OPENCAGE_API_KEY = 'c9a22e9133164287a5d3ecdcc0c73c1d';  // Your OpenCage API key
const AIR_QUALITY_API_KEY = '88090908ba027a102fd983f2e68dc20c';

const App = () => {
  const [center, setCenter] = useState([34.0522, -118.2437]); // Default: Los Angeles
  const [address, setAddress] = useState('Los Angeles, CA');
  const [hazards, setHazards] = useState([]);
  const [score, setScore] = useState(0); // Score based on hazards
  const [suggestions, setSuggestions] = useState([]); // To store address suggestions
  const [loading, setLoading] = useState(false); // To handle loading state for suggestions
  const [rateLimited, setRateLimited] = useState(false); // State to handle rate limit error
  const [showSuggestions, setShowSuggestions] = useState(false); // To control suggestion dropdown visibility
  const [showAirQuality, setShowAirQuality] = useState(false); // Toggle for air quality visibility
  const [airQualityIndex, setAirQualityIndex] = useState(null); // Store air quality index
  const [isLoading, setIsLoading] = useState(false); // State to handle loading state for hazard data

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Function to get ZIP code from latitude and longitude using a geocoding service
  const getZipFromLatLng = async (lat, lon) => {
    try {
      const response = await axios.get('https://api.opencagedata.com/geocode/v1/json', {
        params: {
          key: OPENCAGE_API_KEY,
          q: `${lat},${lon}`,
          limit: 1,
        },
      });

      if (response.data.results.length > 0) {
        const result = response.data.results[0];
        // Extract ZIP code (postal code) from the components
        const zipCode = result.components.postcode;
        return zipCode;
      }
      
      return null;
    } catch (error) {
      console.error("Error getting ZIP code:", error);
      return null;
    }
  };

  // Function to determine which icon to use based on hazard type
  const getHazardIcon = (hazard) => {
    if (hazard.hazardType === 'Superfund') {
      return redIcon;
    } else if (hazard.hazardType === 'TRI') {
      return orangeIcon;
    } else {
      return greyIcon;
    }
  };

  const fetchAirQuality = async (lat, lon) => {
    try {
      const response = await axios.get('https://api.openweathermap.org/data/2.5/air_pollution', {
        params: {
          lat: lat,
          lon: lon,
          appid: AIR_QUALITY_API_KEY,
        },
      });
  
      const airQualityData = response.data.list[0].main;
      const airQualityIndex = airQualityData.aqi;
  
      // Invert AQI scale: 5 -> 1 (bad), 1 -> 10 (good)
      const scaledAQI = 11 - (airQualityIndex * 2);  // Now 5 -> 1 and 1 -> 10
      setAirQualityIndex(scaledAQI); // Store the reversed AQI
      return scaledAQI; // Return the reversed AQI
    } catch (error) {
      console.error('Error fetching air quality data', error);
      return null;
    }
  };
  
  // Function to fetch Superfund sites from EPA Envirofacts SEMS database
  const fetchSuperfundSites = async (lat, lon) => {
    try {
      // First, we need to get the ZIP code for the location
      // since EPA's API searches by ZIP, not lat/lon
      const zipCode = await getZipFromLatLng(lat, lon);
      
      if (!zipCode) {
        console.log("Could not determine ZIP code for location");
        return [];
      }
      
      console.log(`Searching for hazards in ZIP code: ${zipCode}`);
      
      // Construct EPA Envirofacts API URL for SEMS (Superfund) sites
      // Format: https://data.epa.gov/efservice/[program].[table]/[column]/[operator]/[value]/[format]
      const superfundUrl = `https://data.epa.gov/efservice/sems.envirofacts_site/zip_code/equals/${zipCode}/JSON`;
      
      const response = await axios.get(superfundUrl);
      console.log("Superfund API Response:", response.data);
      
      // Transform the EPA data into our hazard format
      if (response.data && Array.isArray(response.data)) {
        return response.data.map(site => {
          // Extract latitude and longitude if available, otherwise use approximate location
          let siteLat = site.latitude ? parseFloat(site.latitude) : lat + (Math.random() * 0.02 - 0.01);
          let siteLng = site.longitude ? parseFloat(site.longitude) : lon + (Math.random() * 0.02 - 0.01);
          
          // Make sure we have valid coordinates
          if (isNaN(siteLat) || isNaN(siteLng) || !siteLat || !siteLng) {
            siteLat = lat + (Math.random() * 0.02 - 0.01);
            siteLng = lon + (Math.random() * 0.02 - 0.01);
          }
          
          return {
            lat: siteLat,
            lng: siteLng,
            type: site.site_name || 'Superfund Site',
            siteId: site.site_id || null,
            hazardType: 'Superfund',
            address: `${site.street_address || ''}, ${site.city_name || ''}, ${site.state_code || ''}`,
            status: site.status_code || 'Unknown Status',
            contaminants: site.contaminant_name || 'Hazardous Materials'
          };
        });
      }
      
      return [];
    } catch (error) {
      console.error("Error fetching Superfund sites:", error);
      return [];
    }
  };

  const fetchHazards = async (lat, lon) => {
    setIsLoading(true);
    try {
      // This will store all our hazards from different sources
      let hazardsArray = [];
      
      // Step 1: Fetch Superfund sites from EPA Envirofacts
      const superfundSites = await fetchSuperfundSites(lat, lon);
      if (superfundSites && superfundSites.length > 0) {
        hazardsArray = [...hazardsArray, ...superfundSites];
      }
      
      // Step 2: Fetch Air Quality data
      const airQualityIndex = await fetchAirQuality(lat, lon);
      if (airQualityIndex !== null) {
        setAirQualityIndex(airQualityIndex);
      }
      
      // If we couldn't fetch any real hazards, use some placeholder data
      if (hazardsArray.length === 0) {
        console.log("No real hazard data found, using placeholders");
        hazardsArray = [
          { lat: lat + 0.01, lng: lon - 0.01, type: 'Factory (Placeholder)', hazardType: 'Placeholder' },
          { lat: lat - 0.02, lng: lon + 0.02, type: 'Oil Well (Placeholder)', hazardType: 'Placeholder' },
          { lat: lat + 0.03, lng: lon - 0.03, type: 'Power Plant (Placeholder)', hazardType: 'Placeholder' },
          { lat: lat - 0.015, lng: lon + 0.015, type: 'Landfill (Placeholder)', hazardType: 'Placeholder' },
          { lat: lat + 0.02, lng: lon + 0.005, type: 'Sewage Discharge (Placeholder)', hazardType: 'Placeholder' },
        ];
      }
      
      // Update state with the hazards
      setHazards(hazardsArray);
      
      // Calculate environmental score
      calculateScore(hazardsArray, lat, lon);
      
    } catch (error) {
      console.error("Error fetching environmental hazards:", error);
      // Fall back to placeholder data if there's an error
      const placeholderHazards = [
        { lat: lat + 0.01, lng: lon - 0.01, type: 'Factory (Placeholder)', hazardType: 'Placeholder' },
        { lat: lat - 0.02, lng: lon + 0.02, type: 'Oil Well (Placeholder)', hazardType: 'Placeholder' },
      ];
      setHazards(placeholderHazards);
      calculateScore(placeholderHazards, lat, lon);
    } finally {
      setIsLoading(false);
    }
  };

  // Update your score calculation function to handle different hazard types
  const calculateScore = (hazards, lat, lon) => {
    let totalScore = 0;
    let count = 0;

    hazards.forEach((hazard) => {
      const distance = haversineDistance(lat, lon, hazard.lat, hazard.lng);
      let hazardScore = 10; // Default score
      
      // Assign base score based on hazard type
      let baseScore = 5;
      if (hazard.hazardType === 'Superfund') {
        baseScore = 2; // Superfund sites are generally higher risk
      } else if (hazard.hazardType === 'TRI') {
        baseScore = 3; // Toxic Release Inventory sites are medium-high risk
      } else if (hazard.hazardType === 'Placeholder') {
        baseScore = 5; // Placeholder data
      }
      
      // Adjust score based on proximity
      if (distance <= 0.1) {
        hazardScore = baseScore - 4; // Very close (0.1 km)
      } else if (distance <= 1) {
        hazardScore = baseScore - 2; // Close (1 km)
      } else if (distance <= 2) {
        hazardScore = baseScore; // Moderate distance (2 km)
      } else if (distance <= 5) {
        hazardScore = baseScore + 2; // Far (5 km)
      } else {
        hazardScore = 10; // Very far
      }
      
      // Ensure hazard score is within 1-10 range
      hazardScore = Math.max(1, Math.min(10, hazardScore));
      
      totalScore += hazardScore;
      count++;
    });

    const averageScore = count > 0 ? totalScore / count : 10;
    setScore(Math.max(1, Math.min(10, averageScore))); // Ensure score is between 1 and 10
  };

  const fetchSuggestions = useCallback(async (query, retryCount = 0) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get('https://api.opencagedata.com/geocode/v1/json', {
        params: {
          key: OPENCAGE_API_KEY,
          q: query,
          limit: 5, // Limit to 5 suggestions
        },
      });

      setSuggestions(response.data.results);
      setRateLimited(false);
      setShowSuggestions(true);
    } catch (error) {
      if (error.response && error.response.status === 429) {
        if (retryCount < 3) {
          await delay(5000); // Retry after 5 seconds
          fetchSuggestions(query, retryCount + 1);
        } else {
          setRateLimited(true);
        }
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearchInput = async (e) => {
    const value = e.target.value;
    setAddress(value);

    if (!rateLimited) {
      fetchSuggestions(value);
    }
  };

  const handleSuggestionClick = async (suggestion) => {
    const { lat, lng } = suggestion.geometry;
    setCenter([parseFloat(lat), parseFloat(lng)]);
    setAddress(suggestion.formatted);
    setSuggestions([]);
    setShowSuggestions(false);
    
    // Fetch hazards for the selected location
    fetchHazards(parseFloat(lat), parseFloat(lng));
  };

  const handleSearch = async () => {
    if (rateLimited) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get('https://api.opencagedata.com/geocode/v1/json', {
        params: {
          key: OPENCAGE_API_KEY,
          q: address,
          limit: 1,
        },
      });

      if (response.data.results.length > 0) {
        const { lat, lng } = response.data.results[0].geometry;
        setCenter([parseFloat(lat), parseFloat(lng)]);
        setAddress(response.data.results[0].formatted);
        fetchHazards(parseFloat(lat), parseFloat(lng));
      } else {
        alert('Address not found!');
      }
    } catch (error) {
      if (error.response && error.response.status === 429) {
        setRateLimited(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Function to set color based on AQI value
  const getAQIColor = (aqi) => {
    if (aqi >= 9) return 'green';    // Excellent (9-10)
    if (aqi >= 7) return 'yellow';   // Good (7-8)
    if (aqi >= 5) return 'orange';   // Moderate (5-6)
    if (aqi >= 3) return 'red';      // Unhealthy (3-4)
    return 'maroon';                 // Very Unhealthy (1-2)
  };

  return (
    <div className="app-container">
      <Navbar />
      <div className="white-box">
        {/* Search and hazard content container */}
        <div className="search-content-container">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search for an address..."
              value={address}
              onChange={handleSearchInput}
              onFocus={() => fetchSuggestions(address)}
              onBlur={() => setTimeout(() => !showSuggestions && setShowSuggestions(false), 100)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />

            {showSuggestions && suggestions.length > 0 && !rateLimited && (
              <ul className="suggestions-list">
                {suggestions.map((suggestion) => (
                  <li key={suggestion.place_id} onClick={() => handleSuggestionClick(suggestion)}>
                    {suggestion.formatted}
                  </li>
                ))}
              </ul>
            )}
            {rateLimited && <p className="error-message">Rate limit exceeded, please try again later.</p>}
          </div>

          {/* Environmental hazard report content */}
          <div className="logistics">
            <h2>Environmental Hazard Report</h2>
            <p><strong>Address:</strong> {address}</p>
            <p><strong>Hazards Nearby:</strong> {hazards.length}</p>
            <p>
              <strong>Environmental Hazard Score: </strong>
              <span className={
                score >= 7 ? "score-good" : 
                score >= 4 ? "score-moderate" : 
                "score-poor"
              }>
                {score.toFixed(1)}
              </span>
              <span className="score-info"> (10 = Excellent, 1 = Poor)</span>
            </p>
            <p>
              <strong>Air Quality Index: </strong>
              {airQualityIndex !== null ? (
                <span className={
                  airQualityIndex >= 7 ? "score-good" : 
                  airQualityIndex >= 4 ? "score-moderate" : 
                  "score-poor"
                }>
                  {airQualityIndex.toFixed(1)}
                </span>
              ) : 'N/A'}
              {airQualityIndex !== null && <span className="score-info"> (10 = Excellent, 1 = Poor)</span>}
            </p>
            
            <h3>Hazards Found:</h3>
            {isLoading ? (
              <div className="loading-indicator">Loading hazard data...</div>
            ) : (
              <div className="hazard-boxes-container">
                {hazards.length === 0 ? (
                  <div className="no-hazards-message">
                    No environmental hazards found in this area. Either there are no documented hazards nearby, 
                    or the data may not be available for this region.
                  </div>
                ) : (
                  hazards.map((hazard, index) => {
                    const distance = haversineDistance(center[0], center[1], hazard.lat, hazard.lng);
                    let distanceClass = '';
                    let impact = '';
                    
                    if (distance < 2) {
                      distanceClass = 'hazard-close';
                      impact = 'Significant';
                    } else if (distance >= 2 && distance <= 5) {
                      distanceClass = 'hazard-medium';
                      impact = 'Moderate';
                    } else {
                      distanceClass = 'hazard-far';
                      impact = 'Minimal';
                    }

                    // Set icon based on hazard type
                    let hazardIcon = '⚠️'; // Default
                    if (hazard.hazardType === 'Superfund') {
                      hazardIcon = '☢️';
                    } else if (hazard.hazardType === 'TRI') {
                      hazardIcon = '🏭';
                    }
                    
                    return (
                      <div key={index} className={`hazard-box ${distanceClass}`}>
                        <div className="hazard-header">
                          <span className="hazard-icon">{hazardIcon}</span>
                          <h4>{hazard.type}</h4>
                        </div>
                        <p className="hazard-distance">{distance.toFixed(2)} km away</p>
                        <p className="hazard-impact">Impact: {impact}</p>
                        
                        {hazard.address && (
                          <p className="hazard-address">
                            <strong>Address:</strong> {hazard.address}
                          </p>
                        )}
                        
                        {hazard.status && hazard.status !== 'Unknown Status' && (
                          <p className="hazard-status">
                            <strong>Status:</strong> {hazard.status}
                          </p>
                        )}
                        
                        {hazard.contaminants && hazard.contaminants !== 'Hazardous Materials' && (
                          <p className="hazard-contaminants">
                            <strong>Contaminants:</strong> {hazard.contaminants}
                          </p>
                        )}
                        
                        {hazard.hazardType !== 'Placeholder' && (
                          <a 
                            href={`https://www.epa.gov/superfund/search-superfund-sites-where-you-live`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="hazard-more-info"
                          >
                            More information
                          </a>
                        )}
                      </div>
                      );
                    })
                  )}
                </div>
              )}
              <button 
                className="toggle-button" 
                onClick={() => setShowAirQuality(!showAirQuality)}
              >
                {showAirQuality ? 'Hide Air Quality Layer' : 'Show Air Quality Layer'}
              </button>
            </div>
          </div>
  
          {/* Separate container for the map */}
          <div className="map-container">
            <MapContainer key={center.join(',')} center={center} zoom={13} scrollWheelZoom={true} className="map">
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
              />
              <Marker position={center} icon={greenIcon}>
                <Popup>
                  <div>
                    <strong>Your Selected Location</strong><br />
                    {address}
                  </div>
                </Popup>
              </Marker>
              {hazards.map((hazard, index) => {
                const distance = haversineDistance(center[0], center[1], hazard.lat, hazard.lng);
                let impact = '';
                
                if (distance <= 0.5) {
                  impact = "Significant";
                } else if (distance <= 2) {
                  impact = "Moderate";
                } else {
                  impact = "Minimal";
                }
                
                return (
                  <Marker 
                    key={index} 
                    position={[hazard.lat, hazard.lng]} 
                    icon={getHazardIcon(hazard)}
                  >
                    <Popup>
                      <div className="hazard-popup">
                        <h3>{hazard.type}</h3>
                        <p><strong>Distance:</strong> {distance.toFixed(2)} km</p>
                        <p><strong>Impact:</strong> {impact}</p>
                        
                        {hazard.address && (
                          <p><strong>Address:</strong> {hazard.address}</p>
                        )}
                        
                        {hazard.status && hazard.status !== 'Unknown Status' && (
                          <p><strong>Status:</strong> {hazard.status}</p>
                        )}
                        
                        {hazard.contaminants && hazard.contaminants !== 'Hazardous Materials' && (
                          <p><strong>Contaminants:</strong> {hazard.contaminants}</p>
                        )}
                        
                        {hazard.hazardType !== 'Placeholder' && (
                          <a 
                            href={`https://www.epa.gov/superfund/search-superfund-sites-where-you-live`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="hazard-more-info"
                          >
                            More information
                          </a>
                        )}
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
              {/* 3 mile radius (4828.03 meters) */}
              <Circle 
                center={center} 
                radius={4828.03} 
                pathOptions={{ color: 'blue', fillOpacity: 0.05 }} 
              />
              {showAirQuality && airQualityIndex !== null && (
                <Circle
                  center={center}
                  radius={5000}
                  pathOptions={{ color: getAQIColor(airQualityIndex), fillOpacity: 0.5 }}
                />
              )}
              {/* Add the Legend component here */}
              <Legend showAirQuality={showAirQuality} />
            </MapContainer>
          </div>
        </div>
      </div>
    );
  };
  
  export default App;