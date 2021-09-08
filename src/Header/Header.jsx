import React from "react"
import { Link } from "react-router-dom"
import './Header.css'

const Header = () => {
    
    return (
        <nav className="navbar navbar-brand bg-info">
                <div>
                    <Link 
                         className="nav-link brand"
                         to="/" exact> 
                        SoccerStat App
                      </Link>

                </div>     
        </nav> 
    )
}

export default Header