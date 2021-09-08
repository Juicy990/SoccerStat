import React from "react"
//import axios from 'axios'
import {
    getCompetition, 
    getSeason
} from "../shared/api";
import {Link} from "react-router-dom";
import {
    withQueryParams,
    StringParam,
    NumberParam,
    ArrayParam,
    withDefault,
  } from "use-query-params";
import SelectMenu from "../SelectMenu/SelectMenu";
import SearchBar from "../SearchBar/SearchBar";
import CalendarSearch from "../CalendarSearch/CalendarSearch";
import {SearchByName, SelectByTeamFound} from "../HelperComponent/HelperComponent";

class League extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            teams: [],
            season: null,
            term: [],
            value: ""
        }

    }
    
    // componentDidMount() {
    //     const searchParams = new URLSearchParams(this.props?.location?.search);
    //     const season = searchParams.get('season');
    //     const leagueId = this.props?.match?.params?.id;

    //     if (!season) {
    //         axios.get(`https://api.football-data.org/v2/competitions/${leagueId}/`, {
    //             headers: {
    //                 'X-Auth-Token': '44c485c7d2544d12b812bcee4420a80c'
    //             },
    //         })
    //         .then(res => {
    //             const season = new Date(res.data?.currentSeason?.startDate).getFullYear()

    //             axios.get(`https://api.football-data.org/v2/competitions/${leagueId}/teams?season=${season}`, {
    //                 headers: {
    //                     'X-Auth-Token': '44c485c7d2544d12b812bcee4420a80c'
    //                 },
    //             })
    //             .then(res => {
    //                 const teams = res.data?.teams;

    //                 this.setState({
    //                     teams,
    //                     term: teams
    //                 })
    //             })
    //         })
    //     }

    //     if (season) {
    //         axios.get(`https://api.football-data.org/v2/competitions/${leagueId}/teams?season=${season}`, {
    //             headers: {
    //                 'X-Auth-Token': '44c485c7d2544d12b812bcee4420a80c'
    //             },
    //         })
    //         .then(res => {
    //             const teams = res.data?.teams;

    //             this.setState({
    //                 teams,
    //                 term: teams
    //             })
    //         })
    //     }
    // }

//     тебе надо в тот обработчик куда вводишь текст например в дидмаунте сразу засетать типа такого
//    handleChange(query.search) - только вместо этого твой обработчик и название квери-параметра

    componentDidMount() {
        const searchParams = new URLSearchParams(this.props?.location?.search);
        const season = searchParams.get('season');
        const leagueId = this.props?.match?.params?.id;

        if (!season) {
            getCompetition(leagueId)
            .then(res => {
                const season = new Date(res.currentSeason?.startDate).getFullYear()

                getSeason(leagueId, season)
                .then(res => {
                    const {teams} = res
                    const {query} = this.props;
                    this.setState({
                        teams,
                        term: teams
                    });
                    this.onInputChange(query.search);
                    this.onSelectChange(query.select);
                    this.handleDateChange('start', query.start);
                    this.handleDateChange('end', query.end);
                })
            })
        }

        if (season) {
            getSeason(leagueId, season)
            .then(res => {
                const {teams} = res
                const {query} = this.props;
                this.setState({
                    teams,
                    term: teams,
                });
                this.onInputChange(query.search);
                this.onSelectChange(query.select);
                this.handleDateChange(query.name)
            })
        }
    }
        
    onInputChange = (value) => {
        const term = SearchByName(value, this.state.teams);
        const { query, setQuery } = this.props;
        setQuery({ search: value });

        this.setState({
            value,
            term
        })
    }


    onSelectChange = (value) => {
        const term = SelectByTeamFound(value, this.state.teams);
        const { query, setQuery } = this.props;
        setQuery({ select: value });
        
        this.setState({
            value,
            term
        })

    }

    componentDidUpdate(_, prevState) {
        if (
          this.state.start !== prevState.start ||
          this.state.end !== prevState.end
        ) {
          this.setState({
            term: this.state.teams.filter((team) => {
              return (
                new Date(this.state.start).getFullYear() <= team.founded &&
                new Date(this.state.end).getFullYear() >= team.founded
              );
            })
          });
        }
    }
    
    handleDateChange = (name, value) => {
        const { query, setQuery } = this.props;
        setQuery({ [name]: value });
        this.setState({ [name]: value });
    }

    render() {

        const {term, teams, value} = this.state;

        const foundedYear = teams.map(team => team.founded).sort();
        const uniqYear = [...new Set(foundedYear.map(match => match))];
  

        return teams?.length ? <div>
            <CalendarSearch onChange={this.handleDateChange} value={value}/>
            <SelectMenu data={uniqYear} onChange={this.onSelectChange} value={value}/>
            <SearchBar onChange={this.onInputChange} value={value}/>
            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th>Название</th>
                        <th>Год основания</th>
                        <th>Сайт</th>
                    </tr>
                </thead>
                <tbody>
                    {term.length ? term.map((team, key) => {
                        return (
                            <tr key={key}>
                                <td><img src={team.crestUrl} alt='TeamLogo' width="50px"/></td>
                                <td><Link to={`/team/${team?.id}`}>{team.name}</Link></td>
                                <td>{team.founded}</td>
                                <td><a href={team.website}>{team.website}</a></td>
                            </tr>
                        )
                    }) : <div>Ничего не найдено...</div>}
                </tbody>
            </table>
        </div> : <div>Loading...</div>
    }

}
export default withQueryParams(
    {
      search: StringParam
    },
    League
);
  