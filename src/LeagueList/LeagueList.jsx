import React from 'react';
//import "./LeagueList.css"
//import axios from 'axios'
import {getCompetitions} from "../shared/api";
import {
    Link
} from "react-router-dom";
import {
    withQueryParams,
    StringParam
  } from "use-query-params";
import SelectMenu from "../SelectMenu/SelectMenu";
import SearchBar from "../SearchBar/SearchBar";
import CalendarSearch from "../CalendarSearch/CalendarSearch";
import {SearchByName, SelectByStartDate} from "../HelperComponent/HelperComponent";


  class LeagueList extends React.Component {
        state = {
            leagues: [],
            term: [],
            value: "",
            start: '',
            end: ''
        }


    // componentDidMount() {
    //     const code = [2000, 2001, 2002, 2003, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2021];

    //     axios.get('https://api.football-data.org/v2/competitions', {
    //         headers: {
    //             'X-Auth-Token': '44c485c7d2544d12b812bcee4420a80c',
    //         }
    //     })
    //         .then(res => {
    //             const competitions = res?.data?.competitions;
    //             const leagues = competitions.filter(competition => code.includes(competition.id));

    //              //console.log(leagues)
    //              const {query} = this.props;
    //             this.setState({
    //                 leagues,
    //                 term: leagues
    //             });
    //         // this.onInputChange(query.search);
    //         // this.onSelectChange(query.select);
    //         // this.handleDateChange('start', query.start);
    //         // this.handleDateChange('end', query.end);
    //         })
    // }

    componentDidMount() {
        const {query} = this.props;
        getCompetitions()
        .then(leagues => {
            
            this.setState(
                {
                    leagues: leagues,
                    term: leagues,
                    start: query.start,
                    end: query.end
                },
                // () => {
                //         let result = leagues;
                //         if (query.search) {
                //             result = result.filter((league) => {
                //                     return league.name.includes(query.search || "");
                //                 })

                //         }
                //         if (query.select) {
                //             result = result.filter((league) => {
                //                 return new Date(league.currentSeason.startDate).getFullYear() === +query.select || "" 
                //                     //|| new Date(league.currentSeason.endDate).getFullYear() === (query.select || "")
                //             })
                //         }
                //         this.setState({
                //             term: result
                //         })
                // }
                () => {
                        this.setState({
                            term: leagues.filter((league) => {
                                return league.name.includes(query.search || "");
                            })
                        })

                        // this.setState({
                        //     term: leagues.filter((league) => {
                        //     return new Date(league.currentSeason.startDate).getFullYear() === +query.select || "" 
                        //         //|| new Date(league.currentSeason.endDate).getFullYear() === (query.select || "")
                        //     })
  
            }
            )
            this.onInputChange(query.search);
            this.onSelectChange(query.select);
            this.handleDateChange('start', query.start);
            this.handleDateChange('end', query.end);
        })
    
    }


    onInputChange = (value) => {
        const { query, setQuery } = this.props;
        setQuery({ search: value });
       
        this.setState({
            value,
             term: this.state.leagues.filter((league) => {
                return league.name.toLowerCase().includes(value);
            })
        })

    }



    onSelectChange = (value) => {
        const term = SelectByStartDate(value, this.state.leagues);
        const { query, setQuery } = this.props;
        setQuery({ select: value });

        this.setState({
            value,
            term: this.state.leagues.filter((league) => {
                return new Date(league.currentSeason.startDate).getFullYear() === +value || new Date(league.currentSeason.endDate).getFullYear() === +value    
            }) 
        })

    }



    componentDidUpdate(_, prevState) {
        if (
          this.state.start !== prevState.start ||
          this.state.end !== prevState.end
        ) {
          this.setState({
                term: this.state.leagues.filter((league) => {
                    return (
                      new Date(this.state.start).getTime() <= new Date(league.currentSeason.startDate).getTime() &&
                      new Date(this.state.end).getTime() >= new Date(league.currentSeason.endDate).getTime()
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
        
        const {term, leagues, value} = this.state;
        const leagueStart = leagues.map(league => new Date(league.currentSeason.startDate).getFullYear()).sort();
        const leagueEnd = leagues.map(league => new Date(league.currentSeason?.endDate).getFullYear()).sort();
        const uniqYear = [...new Set(leagueStart.concat(leagueEnd))];

        return (
            <div>
                <CalendarSearch onChange={this.handleDateChange} value={value}/>
                <SelectMenu data={uniqYear} onChange={this.onSelectChange} value={value}/>
                <SearchBar onChange={this.onInputChange} value={value}/>
                <div className='leagueTable'>
                    <table>
                        <thead>
                            <tr>
                                <th></th>
                                <th>Лига</th>
                                <th>Страна</th>
                                <th>Начало соревнований</th>
                                <th>Окончание соревнований</th>
                            </tr>
                        </thead>
                        <tbody>
                            {term.length ? term.map((league, key) => {
                                return (
                                    <tr key={key}>
                                        <td>
                                            <img src={league?.area?.ensignUrl} alt="leagueLogo" width="50px" />
                                        </td>
                                        <td>
                                            <Link to={`/league/${league?.id}?season=${new Date(league?.currentSeason?.startDate).getFullYear()}`}>
                                                {league?.name}
                                            </Link>
                                        </td>
                                        <td>{league?.area?.name}</td>
                                        <td>{league?.currentSeason?.startDate}</td>
                                        <td>{league?.currentSeason?.endDate}</td>
                                    </tr>
                                )
                            }) : <span>Ничего не найдено</span>}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

export default withQueryParams(
    {
      search: StringParam
    },
    LeagueList
);
  
