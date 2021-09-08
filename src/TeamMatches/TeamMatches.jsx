import React from "react"
//import axios from 'axios'
import {getTeamMatches} from "../shared/api";
import s from "./TeamMatches.module.css"
import {
    withQueryParams,
    StringParam
  } from "use-query-params";
import SelectMenu from "../SelectMenu/SelectMenu";
import SearchBar from "../SearchBar/SearchBar";
import CalendarSearch from "../CalendarSearch/CalendarSearch";
import {SearchByTeamName, SelectByUtcDate} from "../HelperComponent/HelperComponent";

class TeamMatches extends React.Component  {
    state = {
        matches: [],
        term: [],
        value: ""
    }

    // componentDidMount() {
    //     const searchParams = new URLSearchParams(this.props?.location?.search);
    //     const teamId = searchParams.get('teamId');

    //     axios.get(`https://api.football-data.org/v2/teams/${teamId}/matches`, {
    //             headers: {
    //                 'X-Auth-Token': '44c485c7d2544d12b812bcee4420a80c'
    //             },
    //         })
    //         .then(res => {
    //             //console.log(res.data);
    //             const matches = res.data?.matches;

    //             this.setState({
    //                 matches,
    //                 term: matches
    //             })
            
    //         })
    // }

    componentDidMount() {
        const searchParams = new URLSearchParams(this.props?.location?.search);
        const teamId = searchParams.get('teamId');

        getTeamMatches(teamId).then(matches => {
            const {query} = this.props;
            this.setState({
                matches,
                term: matches
            });
            this.onInputChange(query.search);
            this.onSelectChange(query.select);
            this.handleDateChange('start', query.start);
            this.handleDateChange('end', query.end);
            
        })
    }

    onInputChange = (value) => {
        const term = SearchByTeamName(value, this.state.team.squad);
        const { query, setQuery } = this.props;
        setQuery({ search: value });

        this.setState({
            value,
            term
        })
    }


    onSelectChange = (value) => {
        const term = SelectByUtcDate(value, this.state.team.squad);
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
            term: this.state.matches.filter((match) => {
              return (
                new Date(this.state.start).getTime() <= new Date(match.utcDate).getTime() &&
                new Date(this.state.end).getTime() >= new Date(match.utcDate).getTime()
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

        const {term, matches, value} = this.state;

        const matchYear = matches.map(match => new Date(match.utcDate).getFullYear()).sort();
        const uniqYear = Array.from(new Set(matchYear.map(match => match)));
    
        return (
            <div>
                <div className="search-panel">
                <h2>Список матчей</h2>
                <CalendarSearch onChange={this.handleDateChange} value={value}/>
                <SelectMenu data={uniqYear} onChange={this.onSelectChange} value={value}/>
                <SearchBar onChange={this.onInputChange} value={value}/> 
                </div>
                <table>
                <thead>
                    <tr>
                        <th>Дата</th>
                        <th>Соперники</th>
                        <th>Результат матча</th>
                    </tr>
                </thead>
                <tbody>
                    {term.length ? term.map((match, key) => {
                        const {utcDate, awayTeam, homeTeam} = match;
                    return(
                        <tr key={key}>
                            <td>{utcDate}</td>
                            <td>{awayTeam?.name} - {homeTeam?.name}</td>
                            <td>{match?.score?.fullTime?.awayTeam} - {match?.score?.fullTime?.homeTeam}</td>
                        </tr>
                        ) 
                    }) : <div>Ничего не найдено</div>}
                    
                </tbody>    
                </table>
            </div>
        );
    }
}

export default withQueryParams(
    {
      search: StringParam
    },
    TeamMatches
);
  