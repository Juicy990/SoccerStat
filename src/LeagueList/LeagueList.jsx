import React from "react";

import "./LeagueList.css";
import { getCompetitions } from "../shared/api";
import { Link } from "react-router-dom";
import SelectMenu from "../SelectMenu/SelectMenu";
import SearchBar from "../SearchBar/SearchBar";
import CalendarSearch from "../CalendarSearch/CalendarSearch";
import {
  FilteredByDate,
  SetParamsURL,
  GetParamURL,
} from "../HelperComponent/HelperComponent";

class LeagueList extends React.Component {
  state = {
    leagues: [],
    term: [],
    value: "",
    start: "",
    end: "",
    year: "",
    search: "",
    isLoading: false,
  };

  componentDidMount() {
    const start = GetParamURL("start") || "";
    const end = GetParamURL("end") || "";
    const search = GetParamURL("search") || "";

    this.setState({
      start,
      end,
      search,
      isLoading: true,
    });

    getCompetitions().then((leagues) => {
      const term = start || end ? FilteredByDate(start, end, leagues) : leagues;

      this.setState({
        leagues,
        term,
        isLoading: false,
      });
    });
  }

  onInputChange = (value) => {
    this.setState(
      {
        search: value,
        term: FilteredByDate(
          this.state.start,
          this.state.end,
          this.state.leagues
        ).filter((league) => {
          return league.name.toLowerCase().includes(value);
        }),
      },
      () => {
        SetParamsURL("search", value);
      }
    );
  };

  onSelectChange = (value) => {
    const start = value ? `${value}-01-01` : "";
    const end = value ? `${value}-12-31` : "";

    this.setState(
      {
        value,
        term: value
          ? this.state.leagues.filter((league) => {
              const startDate = new Date(
                league.currentSeason.startDate
              ).getFullYear();
              const endDate = new Date(
                league.currentSeason.endDate
              ).getFullYear();

              return startDate === +value && endDate === +value;
            })
          : this.state.leagues,
        year: value,
        start,
        end,
      },
      () => {
        SetParamsURL("start", start);
        SetParamsURL("end", end);
      }
    );
  };

  handleDateChange = (name, value) => {
    this.setState(
      {
        [name]: value,
        term: FilteredByDate(
          this.state.start,
          this.state.end,
          this.state.leagues
        ),
      },
      () => {
        this.setParamsURL();
      }
    );
  };

  setParamsURL = () => {
    const start = this.state.start;
    const end = this.state.end;
    const search = this.state.search;

    SetParamsURL("start", start);
    SetParamsURL("end", end);
    SetParamsURL("search", search);
  };

  render() {
    const { term, leagues, start, end, isLoading, year, search } = this.state;
    const inputValue = { start, end };
    const leagueStart = leagues
      .map((league) => new Date(league.currentSeason.startDate).getFullYear())
      .sort();
    const leagueEnd = leagues
      .map((league) => new Date(league.currentSeason?.endDate).getFullYear())
      .sort();
    const uniqYear = [...new Set(leagueStart.concat(leagueEnd))];

    return (
      <div className="container">
        <CalendarSearch onChange={this.handleDateChange} value={inputValue} />
        <SelectMenu
          data={uniqYear}
          onChange={this.onSelectChange}
          value={year}
        />
        <SearchBar onChange={this.onInputChange} value={search} />
        {isLoading ? (
          <div className="not-found">Загрузка данных...</div>
        ) : term.length ? (
          <table className="table table-bordered border-primary table-hover">
            <thead>
              <tr className="table-bordered border-primary table-primary">
                <th>Герб</th>
                <th>Лига</th>
                <th>Страна</th>
                <th>Начало соревнований</th>
                <th>Окончание соревнований</th>
              </tr>
            </thead>
            <tbody>
              {term.map((league, key) => {
                return (
                  <tr
                    className="table-bordered border-primary table-light"
                    key={key}
                  >
                    <td>
                      <img
                        src={league?.area?.ensignUrl}
                        alt="league-logo"
                        width="50px"
                      />
                    </td>
                    <td>
                      <Link
                        to={`/league/${league?.id}?season=${new Date(
                          league?.currentSeason?.startDate
                        ).getFullYear()}`}
                      >
                        {league?.name}
                      </Link>
                    </td>
                    <td>{league?.area?.name}</td>
                    <td>{league?.currentSeason?.startDate}</td>
                    <td>{league?.currentSeason?.endDate}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="not-found">Ничего не найдено...</div>
        )}
      </div>
    );
  }
}

export default LeagueList;
