import React from "react";
//import axios from 'axios'
import "./Team.css";
import { getTeam } from "../shared/api";
import { Link } from "react-router-dom";
import SelectMenu from "../SelectMenu/SelectMenu";
import SearchBar from "../SearchBar/SearchBar";
import {
  SearchByName,
  SelectByBirth,
  SetParamsURL,
  GetParamURL,
} from "../HelperComponent/HelperComponent";

class Team extends React.Component {
  state = {
    team: null,
    term: [],
    value: "",
    year: "",
    searched: "",
  };

  componentDidMount() {
    const teamId = this.props?.match?.params?.id;
    const select = GetParamURL('select') || "";
    const search = GetParamURL('search') || "";
    getTeam(teamId).then((team) => {
      this.setState({
        team: team,
        term: team.squad,
      });
      
      this.onSelectChange(select);
      this.onSelectChange(search);
    });
  }

  onInputChange = (value) => {
    const term = SearchByName(value, this.state.team.squad);

    this.setState({
      term,
      searched: value,
    }, () => {
        SetParamsURL('search', value);
    });
  };

  onSelectChange = (value) => {
    const term = SelectByBirth(value, this.state.team.squad);

    this.setState({
      term,
      year: value,
    }, () => {
        SetParamsURL('select', value);
    });
  };

  setParamsURL = () => {
    const search = this.state.searched;
    const select = this.state.year;

    SetParamsURL('search', search);
    SetParamsURL('select', select);
  };


  render() {
    const { term, team, year, searched } = this.state;
    const squad = this.state.team ? this.state.team.squad : [];
    const code = [
      2000, 2001, 2002, 2003, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2021,
    ];

    const birthYear = squad
      .map((sq) => new Date(sq.dateOfBirth).getFullYear())
      .sort();
    const uniqYear = [...new Set(birthYear.map((match) => match))];

    return (
      <div className="container">
        <div className="row">
          <div className="col-lg-6">
            <div className="left-side">
              <h1>{team?.name}</h1>
              <img src={team?.crestUrl} className="team-logo" alt="teamLogo" />
            </div>
            <div className="left-side">
              <h4>Год основания:</h4>
              <p className="team-info">{team?.founded}</p>
            </div>
            <div className="left-side">
              <a href={team?.website}>Посетить веб-сайт команды</a>
            </div>
            <div className="left-side">
              <Link to={`/matches?teamId=${team?.id}`}>
                Список матчей команды
              </Link>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="right-side">
              <h4>Место тренировок:</h4>
              <p className="team-info">{team?.venue}</p>
            </div>
            <div className="right-side">
              <h4>Телефон:</h4>
              <p className="team-info">{team?.phone}</p>
            </div>
            <div className="right-side">
              <h4>Участие в лигах:</h4>
              <ul>
                {team?.activeCompetitions.map((competition, key) => {
                  return (
                    <li className="team-links" key={key}>
                      {code.includes(competition.id) ? (
                        <Link to={`/league/${competition.id}`}>
                          {competition.name}
                        </Link>
                      ) : (
                        <span>{competition.name}</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
        <div className="search-panel">
          <h2 className="title-team">Состав команды:</h2>
          <SelectMenu
            data={uniqYear}
            onChange={this.onSelectChange}
            value={year}
          />
          <SearchBar onChange={this.onInputChange} value={searched} />
        </div>
        <div className="TeamTable">
          <table className="table table-bordered border-primary table-hover">
            <thead>
              <tr className="table-bordered border-primary table-primary">
                <th>Имя</th>
                <th>Позиция</th>
                <th>Год рождения</th>
                <th>Место рождения</th>
              </tr>
            </thead>
            <tbody>
              {term.length ? (
                term.map((player, key) => {
                  const { name, position, dateOfBirth, countryOfBirth } =
                    player;
                  return (
                    <tr
                      className="table-bordered border-primary table-light"
                      key={key}
                    >
                      <td>{name}</td>
                      <td>{position}</td>
                      <td>{new Date(dateOfBirth).getFullYear()}</td>
                      <td>{countryOfBirth}</td>
                    </tr>
                  );
                })
              ) : (
                <div className="not-found">Ничего не найдено...</div>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default Team;
