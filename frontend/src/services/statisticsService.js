import api from './api';

export async function getPublicStatistics(filters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== '' && value !== false && value !== null && value !== undefined) {
      params.append(key, value);
    }
  });
  const response = await api.get(`/statistics/public/?${params.toString()}`);
  return response.data.data;
}

export function getPublicStatisticsExportUrl(filters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== '' && value !== false && value !== null && value !== undefined) {
      params.append(key, value);
    }
  });
  return `/api/statistics/public/export/?${params.toString()}`;
}

export async function getTeamStatistics(teamId) {
  const path = teamId ? `/statistics/team/${teamId}/` : '/statistics/team/';
  const response = await api.get(path);
  return response.data.data;
}
