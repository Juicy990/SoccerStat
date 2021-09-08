

const SearchByName = (value, array) => {
    const myArray = array ? array : [];
    const term = myArray.filter((item) => {
        return item && item.name.toLowerCase().includes(value.toLowerCase());
    });

    return term;
}


const SearchByTeamName = (value, array) => {
    const myArray = array ? array : [];
    const term = myArray.filter(match => {
        //const {awayTeam, homeTeam} = match;
        return match.awayTeam.name.toLowerCase().includes(value.toLowerCase()) || match.homeTeam.name.toLowerCase().includes(value.toLowerCase());
    });
    
    return term;
}

const SelectByTeamFound = (value, array) => {
    const myArray = array ? array : [];
    const term = myArray.filter((team) => {
        return team.founded === value
    });
    
    return term;
}

const SelectByUtcDate = (value, array) => {
    const myArray = array ? array : [];
    const term = myArray.filter((match) => {
        return new Date(match.utcDate).getFullYear() === value
    });
    
    return term;
}

const SelectByStartDate = (value, array) => {
    const myArray = array ? array : [];
    const term = myArray.filter((league) => {
        return new Date(league.currentSeason.startDate).getFullYear() === value || new Date(league.currentSeason.endDate).getFullYear() === value    
    }); 
    
    return term;
}

const SelectByBirth = (value, array) => {
    const myArray = array ? array : [];
    const term = myArray.filter((sq) => {
        return new Date(sq.dateOfBirth).getFullYear() === value
    });

   return term;
}

    
module.exports = {
    SearchByName,
    SearchByTeamName,
    SelectByStartDate,
    SelectByUtcDate,
    SelectByTeamFound,
    SelectByBirth
}