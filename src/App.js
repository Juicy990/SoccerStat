import React from "react";
import Header from "./Header/Header";
import LeagueList from "./LeagueList/LeagueList";
import League from "./League/League";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import Team from "./Team/Team";
import TeamMatches from "./TeamMatches/TeamMatches";

const App = () => {
  return (
    <Router>
      <Header />
      <div className="container pt-4">
        <Switch>
          <Route exact="true" path="/" component={LeagueList} />
          <Route exact="true" path="/league/:id" component={League} />
          <Route exact="true" path="/team/:id" component={Team} />
          <Route exact="true" path="/matches" component={TeamMatches} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;
