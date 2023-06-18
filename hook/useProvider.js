import { fetchAPI } from '@/lib/fetcher';
import { METHOD, PROVIDER } from '@/lib/endpoint';

export const UseProvidersByCategory = async (body) => {
  const data = await fetchAPI(METHOD.POST, PROVIDER.GET_PROVIDER_BY_CATEGORY, body);
  return data;
};
