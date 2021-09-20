import React from "react";

import "./League.css";
import { getCompetition, getSeason } from "../shared/api";
import { Link } from "react-router-dom";
import SelectMenu from "../SelectMenu/SelectMenu";
import SearchBar from "../SearchBar/SearchBar";
import {
  SearchByName,
  SelectByTeamFound,
  SetParamsURL,
  GetParamURL,
} from "../HelperComponent/HelperComponent";

class League extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      teams: [],
      season: null,
      term: [],
      value: "",
      founded: "",
      searched: ""
    };
  }

  componentDidMount() {
    const searchParams = new URLSearchParams(this.props?.location?.search);
    const season = searchParams.get("season");
    const leagueId = this.props?.match?.params?.id;
    const select = GetParamURL('select') || "";
    const search = GetParamURL('search') || "";

    if (!season) {
      getCompetition(leagueId).then((res) => {
        const season = new Date(res.currentSeason?.startDate).getFullYear();

        getSeason(leagueId, season).then((res) => {
          const { teams } = res;

          this.setState({
            teams,
          });

          this.onSelectChange(select);
          this.onSelectChange(search);
        });
      });
    }

    if (season) {
      getSeason(leagueId, season).then((res) => {
        const { teams } = res;

        this.setState({
          teams,
        });

        this.onSelectChange(select);
        this.onSelectChange(search);
      });
    }

  }

  onInputChange = (value) => {
    const term = SearchByName(value, this.state.teams);

    this.setState({
      term,
      searched: value,
    }, () => {
        SetParamsURL('search', value);
    });
  };

  onSelectChange = (value) => {
    const term = SelectByTeamFound(value, this.state.teams);

    this.setState({
      term,
      founded: value,
    }, () => {
      SetParamsURL('select', value);
    });
  };

  setParamsURL = () => {
    const search = this.state.searched;
    const select = this.state.founded;

    SetParamsURL('search', search);
    SetParamsURL('select', select);
  };

  render() {
    const { term, teams, founded, searched } = this.state;

    const foundedYear = teams.map((team) => team.founded).sort();
    const uniqYear = [...new Set(foundedYear.map((match) => match))];

    return teams?.length ? (
      <div>
        <div className="container">
          <SelectMenu
            data={uniqYear}
            onChange={this.onSelectChange}
            value={founded}
          />
          <SearchBar onChange={this.onInputChange} value={searched} />
          <table className="table table-bordered border-primary table-hover">
            <thead>
              <tr className="table-bordered border-primary table-primary">
                <th>Герб</th>
                <th>Название</th>
                <th>Год основания</th>
                <th>Сайт</th>
              </tr>
            </thead>
            <tbody>
              {term.length ? (
                term.map((team, key) => {
                  return (
                    <tr
                      className="table-bordered border-primary table-light"
                      key={key}
                    >
                      <td>
                        <img src={team.crestUrl} alt="TeamLogo" width="50px" />
                      </td>
                      <td>
                        <Link to={`/team/${team?.id}`}>{team.name}</Link>
                      </td>
                      <td>{team.founded}</td>
                      <td>
                        <a href={team.website}>{team.website}</a>
                      </td>
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
    ) : (
      <div>Loading...</div>
    );
  }
}
export default League

