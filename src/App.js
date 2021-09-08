import React from "react"
// import ReactDOM from "react-dom"
import Header from './Header/Header'
import LeagueList from './LeagueList/LeagueList'
import League from './League/League'
import {
    BrowserRouter as Router,
    Switch,
    Route
  } from "react-router-dom";
import './App.css';
import Team from "./Team/Team";
import TeamMatches from "./TeamMatches/TeamMatches";
 
 const App = () => {
    return (
        <Router>
            <Header/>
                <div className="container pt-4">
                    <Switch>
                        <Route exact path="/" component={LeagueList}/>
                        <Route exact path="/league/:id" component={League}/>
                        <Route exact path="/team/:id" component={Team}/>
                        <Route exact path="/matches" component={TeamMatches}/>
                    </Switch>
                </div>
        </Router>
        )
    
}

export default App;


