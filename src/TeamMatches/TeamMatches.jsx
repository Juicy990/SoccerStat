import React from "react";
import { getTeamMatches } from "../shared/api";
import "./TeamMatches.css";
import SelectMenu from "../SelectMenu/SelectMenu";
import SearchBar from "../SearchBar/SearchBar";
import CalendarSearch from "../CalendarSearch/CalendarSearch";
import {
  FilteredByMatchesDate,
  SetParamsURL,
  GetParamURL,
} from "../HelperComponent/HelperComponent";

class TeamMatches extends React.Component {
  state = {
    matches: [],
    term: [],
    value: "",
    start: "",
    end: "",
    search: "",
    isLoading: false,
    year: "",
  };

  componentDidMount() {
    const searchParams = new URLSearchParams(this.props?.location?.search);
    const teamId = searchParams.get("teamId");
    const start = GetParamURL("start") || "";
    const end = GetParamURL("end") || "";
    const search = GetParamURL("search") || "";
    this.setState({
      start,
      end,
      search,
      isLoading: true,
    });

    getTeamMatches(teamId).then((matches) => {
      const term =
        start || end ? FilteredByMatchesDate(start, end, matches) : matches;
      this.setState({
        matches,
        term,
        isLoading: false,
      });
    });
  }

  onInputChange = (value) => {
    this.setState(
      {
        search: value,
        term: FilteredByMatchesDate(
          this.state.start,
          this.state.end,
          this.state.matches
        ).filter((match) => {
          return (
            match.awayTeam.name.toLowerCase().includes(value) ||
            match.homeTeam.name.toLowerCase().includes(value)
          );
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
          ? this.state.matches.filter((match) => {
              const matchDate = new Date(match.utcDate).getFullYear();
              return matchDate === +value;
            })
          : this.state.matches,
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
        term: FilteredByMatchesDate(
          this.state.start,
          this.state.end,
          this.state.matches
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
    const { term, matches, isLoading, year, search, start, end } = this.state;
    const inputValue = { start, end };
    const matchYear = matches
      .map((match) => new Date(match.utcDate).getFullYear())
      .sort();
    const uniqYear = Array.from(new Set(matchYear.map((match) => match)));

    return (
      <div className="container">
        <h2 className="matches-title">Список матчей:</h2>
        <CalendarSearch onChange={this.handleDateChange} value={inputValue} />
        <SelectMenu
          data={uniqYear}
          onChange={this.onSelectChange}
          value={year}
        />
        <SearchBar onChange={this.onInputChange} value={search} />
        {isLoading ? (
          <div className="not-found">Загрузка данных...</div>
        ) : (
          <table className="table table-bordered border-primary table-hover">
            <thead>
              <tr className="table-bordered border-primary table-primary">
                <th>Дата</th>
                <th>Соперники</th>
                <th>Результат матча</th>
              </tr>
            </thead>
            <tbody>
              {term.length ? (
                term.map((match, key) => {
                  const { utcDate, awayTeam, homeTeam } = match;
                  return (
                    <tr
                      className="table-bordered border-primary table-light"
                      key={key}
                    >
                      <td>
                        {new Date(utcDate)
                          .toLocaleDateString()
                          .split(".")
                          .join("-")}
                      </td>
                      <td>
                        {awayTeam?.name} - {homeTeam?.name}
                      </td>
                      <td>
                        {match?.score?.fullTime?.awayTeam} -{" "}
                        {match?.score?.fullTime?.homeTeam}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <div className="not-found">Ничего не найдено</div>
              )}
            </tbody>
          </table>
        )}
      </div>
    );
  }
}

export default TeamMatches;
