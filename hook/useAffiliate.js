import { fetchAPI } from '@/lib/fetcher';
import { METHOD, AFFILIATE } from '@/lib/endpoint';

export const UseFetchAffiliateInfo = async () => {
  const data = await fetchAPI(METHOD.GET, AFFILIATE.GET_INFO);
  return data;
};

export const UseFetchAffiliateBalance = async () => {
  const data = await fetchAPI(METHOD.GET, AFFILIATE.FETCH_BALANCE);
  return data;
};

export const UseGetBalance = async (body) => {
  const data = await fetchAPI(METHOD.POST, AFFILIATE.GET_BALANCE, body);
  return data;
};

export const UseClickRefId = async (body) => {
  const data = await fetchAPI(METHOD.PATCH, AFFILIATE.REFID, body);
  return data;
};