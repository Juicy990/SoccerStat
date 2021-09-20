import * as axios from "axios";

const template = axios.create({
  baseURL: "https://api.football-data.org/v2/",
  headers: {
    "X-Auth-Token": "44c485c7d2544d12b812bcee4420a80c",
  },
});

export const availableCompetitions = [
  2000, 2001, 2002, 2003, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2021,
];

export const getCompetitions = async () => {
  const response = await template.get(`competitions`);
  return response.data.competitions.filter((competition) =>
    availableCompetitions.includes(competition.id)
  );
};

const getEuropianCompetitions = async () => {
  const response = await template.get(`competitions?areas=2077`);
  return response.data.competitions.filter((competition) =>
    availableCompetitions.includes(competition.id)
  );
};

export const getCompetition = async (leagueId) => {
  const response = await template.get(`competitions/${leagueId}`);
  return response.data;
};

export const getSeason = async (leagueId, season) => {
  const response = await template.get(
    `competitions/${leagueId}/teams${season ? `${`?season=${season}`}` : ""}`
  );
  return response.data;
};

const getSeasonMatches = async (leagueId, season, dateFrom, dateTo) => {
  const response = await template.get(
    `/competitions/${leagueId}/matches?${
      season ? `${`season=${season}`}` : ""
    }${dateFrom ? `${`&dateFrom=${dateFrom}`}` : ""}${
      dateTo ? `${`&dateTo=${dateTo}`}` : ""
    }`
  );
  return response.data.matches;
};

export const getTeam = async (teamId) => {
  const response = await template.get(`/teams/${teamId}`);
  return response.data;
};

export const getTeamMatches = async (teamId, from, to) => {
  const response = await template.get(
    `/teams/${teamId}/matches${
      from ? `?${`dateFrom=${from}&dateTo=${to}`}` : ""
    }`
  );
  return response.data.matches;
};

const api = {
  getEuropianCompetitions,
  getCompetition,
  getSeason,
  getSeasonMatches,
  getTeamMatches,
  getTeam,
  getCompetitions,
};

export default api;
