import { fetchAPI } from '@/lib/fetcher';
import { METHOD, GROUP } from '@/lib/endpoint';

export const UseGetGroup = async () => {
  const data = await fetchAPI(METHOD.GET, GROUP.GET_GROUP);
  return data;
};
