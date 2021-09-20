import React from "react";

const SearchBar = ({ onChange, value }) => {
  return (
    <div className="search-panel">
      <input
        className="input-form form-control"
        type="text"
        placeholder="Поиск"
        onChange={(e) => onChange(e.target.value)}
        value={value}
      />
    </div>
  );
};

export default SearchBar;
