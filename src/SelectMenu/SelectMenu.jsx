import React from "react";
import "./SelectMenu.css";

const SelectMenu = ({ data, onChange, value }) => {
  return (
    <div className="select-panel">
      <div className="row">
        <label className="form-text">Выберите год:</label>
        <select
          className="form-select form-select-sm"
          onChange={(e) => onChange(e.target.value)}
          value={value}
        >
          <option value="">&mdash;</option>
          {data.map((year, key) => (
            <option key={key} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SelectMenu;
