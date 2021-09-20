import React from "react";
import "./CalendarSearch.css";

const CalendarSearch = ({ onChange, value }) => {
  return (
    <div className="calendarSearch">
      <div className="row">
        <div className="col-lg-4">
          <label className="form-text">С:</label>
          <input
            type="date"
            name="start"
            className="startForm"
            min="1800-01-01"
            max="2022-12-31"
            value={value.start}
            onChange={(e) => onChange(e.target.name, e.target.value)}
          />
        </div>
        <div className="col-lg-4">
          <label className="form-text">По:</label>
          <input
            type="date"
            name="end"
            className="endForm"
            min="1800-01-01"
            max="2022-12-31"
            value={value.end}
            onChange={(e) => onChange(e.target.name, e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default CalendarSearch;
