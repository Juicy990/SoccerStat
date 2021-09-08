import React from "react"
import './CalendarSearch.css';

const CalendarSearch = ({onChange, value}) => {
   
    return (
        <div>
                <label className="form-text">Start date:</label>
                <input type="date"
                    name="start"
                    min="1800-01-01" 
                    max="2022-12-31"
                    value={value}
                    onChange={e => onChange(e.target.name, e.target.value)}
                />
                {/* <button 
                    type="submit">
                    &#10003;
                </button> */}

                <label className="form-text">End date:</label>
                <input type="date"
                    name="end" 
                    min="1800-01-01" 
                    max="2022-12-31"
                    value={value}
                    onChange={e => onChange(e.target.name, e.target.value)}
                />
                {/* <button 
                    type="submit">
                        &#10003;
                </button>  */}
        </div>
    )
}

export default CalendarSearch