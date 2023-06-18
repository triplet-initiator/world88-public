import { fetchAPI } from '@/lib/fetcher';
import { METHOD, GAME } from '@/lib/endpoint';

export const UseLaunchGame = async (body) => {
  const data = await fetchAPI(METHOD.POST, GAME.LAUNCH_GAME, body);
  return data;
};

export const UseGamesByCategory = async (body) => {
  const data = await fetchAPI(METHOD.POST, GAME.GET_GAMES_BY_CATEGORY, body);
  return data;
};
