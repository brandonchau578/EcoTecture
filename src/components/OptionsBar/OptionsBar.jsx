import React, {useState} from 'react'
import './OptionsBar.css'
import { UilSearch } from '@iconscout/react-unicons'
import Select from 'react-select'

const TypeOptions =[
    {value: 'ForSale', label: 'For Sale'},
    {value: 'ForRent', label: 'For Rent'},
    {value: 'Sold', label: 'Sold'}
]

const HomeType=[
    {value: 'Apartments', label: 'Apartments'},
    {value:'Houses',label:'Houses'},
    {value:'Townhomes', label:'Townhomes'}
]


function OptionsBar() {
    const [selectedType, setSelectedType] = useState(null);
    const [selectedHomeType, setSelectedHomeType] = useState(null);
  
    const handleTypeChange = (option) => {
      setSelectedType(option);
    };
  
    const handleHomeTypeChange = (option) => {
      setSelectedHomeType(option);
    };
  return (
    <div className = "OptionsBar">
        <div className = "OptionsBarContainer">
            <input className = "SearchBar" type="search" placeholder='City, Neighborhood, ZIP, Address' results/>
            <span className="SearchIcon"><UilSearch/></span>
            <div className = "HouseOptions">
                <Select 
                options = {TypeOptions} 
                className={`CustomSelect ${selectedType ? 'highlighted' : ''}`}
                placeholder="Type"
                classNamePrefix="react-select"
                value={selectedType}
                onChange={handleTypeChange}
                />
                <Select 
                value={selectedHomeType}
                onChange={handleHomeTypeChange}
                options={HomeType}
                className={`CustomSelect ${selectedHomeType ? 'highlighted' : ''}`}
                placeholder="Home Type (4)"
                classNamePrefix="react-select"
                 />
            </div>
        </div>
        
    </div>
  )
}

export default OptionsBar