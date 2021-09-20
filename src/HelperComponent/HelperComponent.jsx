const SearchByName = (value, array) => {
  const myArray = array ? array : [];
  const term = myArray.filter((item) => {
    return (
      value && item && item.name?.toLowerCase()?.includes(value?.toLowerCase())
    );
  });

  return value ? term : array;
};

const SearchByTeamName = (value, array) => {
  const myArray = array ? array : [];
  const term = myArray.filter((match) => {
    //const {awayTeam, homeTeam} = match;
    return (
      match.awayTeam.name.toLowerCase().includes(value.toLowerCase()) ||
      match.homeTeam.name.toLowerCase().includes(value.toLowerCase())
    );
  });

  return term;
};

const SelectByTeamFound = (value, array) => {
  const myArray = array ? array : [];
  const term = myArray.filter((team) => {
    return value && team.founded === +value;
  });

  return value ? term : array;
};

const SelectByCurrentSeasonDate = (value, array) => {
  console.log(array)
  if (!array.length) {
    return [];
  }

  const leagues = array ? array.leagues : [];
  const term =
    leagues?.length &&
    leagues.filter((league) => {
      const startDate = new Date(league.currentSeason.startDate).getFullYear();
      const endDate = new Date(league.currentSeason.endDate).getFullYear();

      return startDate === +value && endDate === +value;
    }) | [];

  return value ? term : array;
};

const SelectByUtcDate = (value, array) => {
  const myArray = array ? array : [];
  const term = myArray.filter((match) => {
    return new Date(match.utcDate).getFullYear() === +value;
    
  });

  return value ? term : array;
};

const SelectByStartDate = (value, array) => {
  const myArray = array ? array : [];
  const term = myArray.filter((league) => {
    return (
      new Date(league.currentSeason.startDate).getFullYear() === value ||
      new Date(league.currentSeason.endDate).getFullYear() === value
    );
  });

  return term;
};

const SelectByBirth = (value, array) => {
  const myArray = array ? array : [];
  const term = myArray.filter((sq) => {
    return new Date(sq.dateOfBirth).getFullYear() === +value;
  });

  return value ? term : array;
};

const FilteredByDate = (start, end, leagues) => {
  return leagues.filter((league) => {
    const startDate = new Date(start).getTime();
    const endDate = new Date(end).getTime();

    const currentStartDate = new Date(league.currentSeason.startDate).getTime();
    const currentEndDate = new Date(league.currentSeason.endDate).getTime();

    if (start && end) {
      return startDate <= currentStartDate && endDate >= currentEndDate;
    }

    if (start) {
      return startDate <= currentStartDate;
    }

    if (end) {
      return endDate >= currentEndDate;
    }

    return league;
  });
};

const FilteredByMatchesDate = (start, end, matches) => {
  return matches.filter((match) => {
    const startDate = new Date(start).getTime();
    const endDate = new Date(end).getTime();

    const currentStartDate = new Date(match.utcDate).getTime();
    const currentEndDate = new Date(match.utcDate).getTime();

    if (start && end) {
      return startDate <= currentStartDate && endDate >= currentEndDate;
    }

    if (start) {
      return startDate <= currentStartDate;
    }

    if (end) {
      return endDate >= currentEndDate;
    }

    return match;
  });
};

let paramsList = [];

const SetParamsURL = (paramKey, paramValue) => {
  let param = "?";
  paramsList[paramKey] = paramValue;

  if (!paramValue) {
    param = "";
  }
  if (paramValue) {
    param += Object.entries(paramsList).map(([k, v]) => {
      if (v) {
        return `${k}=${v}`;
      }
    }).join('&');
  }
  
  window.history.pushState(null, null, param);
};


const GetParamURL = (name) => {
  if (
    (name = new RegExp("[?&]" + encodeURIComponent(name) + "=([^&]*)").exec(
      window.location.search
    ))
  ) {
    return decodeURIComponent(name[1]);
  }
};

module.exports = {
  SearchByName,
  SearchByTeamName,
  SelectByStartDate,
  SelectByUtcDate,
  SelectByTeamFound,
  SelectByBirth,
  FilteredByDate,
  FilteredByMatchesDate,
  SetParamsURL,
  GetParamURL,
  SelectByCurrentSeasonDate,
};
