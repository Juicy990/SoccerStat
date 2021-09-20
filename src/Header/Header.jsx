import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

const Header = () => {
  return (
    <nav className="navbar navbar-brand bg-info">
      <Link className="nav-link brand" to="/" exact="true">
        SoccerStat App
      </Link>
    </nav>
  );
};

export default Header;
