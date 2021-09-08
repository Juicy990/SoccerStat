import React from 'react';
import './SearchBar.css';

const SearchBar = ({onChange, value}) => {

    
    return (
        <div className="search-panel">
            <input 
                className="form-control search-input"
                type="text" 
                placeholder="Поиск"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />   
        </div>
    )
}

export default SearchBar
