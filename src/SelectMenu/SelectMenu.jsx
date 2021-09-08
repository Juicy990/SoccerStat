import React from "react";
import './SelectMenu.css';

const SelectMenu = ({data, onChange, value}) => {
 
    return (
        <div className="search-panel">
            <label>Выберите год: </label>
                <select className="form-select form-select-sm" onChange={(e) => onChange(e.target.value)} value={value}>
                    <option>
                        &mdash;
                    </option>
                    {data.map((year, key) =>
                        <option key={key} value={year}>
                            {year}
                        </option>)} 
                </select>
        </div>
    )
} 

export default SelectMenu