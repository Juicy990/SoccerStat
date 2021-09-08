import React from "react"
//import axios from 'axios'
import {getTeam} from "../shared/api";
import { Link } from "react-router-dom";
import {
    withQueryParams,
    StringParam
  } from "use-query-params";
import SelectMenu from "../SelectMenu/SelectMenu";
import SearchBar from "../SearchBar/SearchBar";
import CalendarSearch from "../CalendarSearch/CalendarSearch";
import {SearchByName, SelectByBirth} from "../HelperComponent/HelperComponent";


class Team extends React.Component {
    state = {
        team: null,
        term: [],
        value: "" 
    }

    // componentDidMount() {
        
    //     const teamId = this.props?.match?.params?.id;

    //     axios.get(`https://api.football-data.org/v2/teams/${teamId}`, {
    //             headers: {
    //                 'X-Auth-Token': '44c485c7d2544d12b812bcee4420a80c'
    //             },
    //         })
    //         .then(res => {
    //             const team = res.data;

    //             this.setState({
    //                 team,
    //                 term: team.squad
    //             })
            
    //         })
    // }

    componentDidMount() {
        const teamId = this.props?.match?.params?.id;      
        getTeam(teamId).then(team => {
            const {query} = this.props;
            this.setState({
                team: team,
                term: team.squad
            });
            this.onInputChange(query.search);
            this.onSelectChange(query.select);
            this.handleDateChange('start', query.start);
            this.handleDateChange('end', query.end);
            
        })
    }

    onInputChange = (value) => {
        const term = SearchByName(value, this.state.team.squad);
        const { query, setQuery } = this.props;
        setQuery({ search: value });

        this.setState({
            value,
            term
        })
    }


    onSelectChange = (value) => {
        const term = SelectByBirth(value, this.state.team.squad);
        const { query, setQuery } = this.props;
        setQuery({ select: value });
        
        this.setState({
            value,
            term
        })

    }

    componentDidUpdate(_, prevState) {

        const squad = this.state.team ? this.state.team.squad : [];
        if (
          this.state.start !== prevState.start ||
          this.state.end !== prevState.end
        ) {
          this.setState({
            term: squad.filter((sq) => {
              return (
                new Date(this.state.start).getFullYear() <= new Date(sq.dateOfBirth).getFullYear() &&
                new Date(this.state.end).getFullYear() >= new Date(sq.dateOfBirth).getFullYear()
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
        
        
        const {term, team, value} = this.state;
        const squad = this.state.team ? this.state.team.squad : [];
        const code = [2000,2001,2002,2003,2013,2014,2015,2016,2017,2018,2019,2021];

        const birthYear = squad.map(sq => new Date(sq.dateOfBirth).getFullYear()).sort();
        const uniqYear = [...new Set(birthYear.map(match => match))];
  
        return (
            
            <div>
                <h1>{team?.name}</h1>
                <img src={team?.crestUrl} alt='teamLogo'/>
                <div>
                    <a href={team?.website}>Посетить веб-сайт команды</a>
                </div>
                <div>
                    <h2>Телефон</h2>
                    <p>{team?.phone}</p>
                </div>
                <div>
                    <h2>Год основания</h2>
                    <p>{team?.founded}</p>
                </div>
                <div>
                    <h2>Место тренировок</h2>
                    <p>{team?.venue}</p>
                </div>
                <div>
                    <h2>Участие в лигах</h2>
                    <ul>
                        {team?.activeCompetitions.map((competition, key) => {
                            return (
                                <li key={key}>
                                    {code.includes(competition.id) ? 
                                <Link to={`/league/${competition.id}`}>{competition.name}</Link>
                                : <span>{competition.name}</span>}
                                </li>
                            )
                        })}
                    
                    </ul>
                </div>
                <div>
                    <Link to={`/matches?teamId=${team?.id}`}>Список матчей команды</Link>
                </div>
                <div className="search-panel">
                <h2>Состав команды</h2>
                <CalendarSearch onChange={this.handleDateChange} value={value}/>
                <SelectMenu data={uniqYear} onChange={this.onSelectChange} value={value}/>
                <SearchBar onChange={this.onInputChange} value={value}/> 
                </div> 
                <div>
                    <table>
                        <thead>
                            <tr>
                                <th>Имя</th>
                                <th>Позиция</th>
                                <th>Год рождения</th>
                                <th>Место рождения</th>
                            </tr>
                        </thead>
                        <tbody>
                            {term.length ? term.map((player, key) => {
                                const {name, position, dateOfBirth, countryOfBirth} = player;
                                return(
                                    <tr key={key}>
                                        <td>{name}</td>
                                        <td>{position}</td>
                                        <td>{new Date(dateOfBirth).getFullYear()}</td>
                                        <td>{countryOfBirth}</td>
                                    </tr>
                                )
                            }) : <div>Ничего не найдено...</div>}
                        </tbody>
                    </table>
                </div>
            </div>

            
    
        
        )}
    
}

export default withQueryParams(
    {
      search: StringParam
    },
    Team
);
  