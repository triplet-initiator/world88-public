import { fetchAPI } from '@/lib/fetcher';
import { METHOD, PROMOTION } from '@/lib/endpoint';

export const UseFetchPromotion = async (body) => {
  const data = await fetchAPI(METHOD.POST, PROMOTION.FETCH, body);
  return data;
};

export const UseCashback = async () => {
  const data = await fetchAPI(METHOD.POST, PROMOTION.CASHBACK);
  return data;
};

export const UseGetPromotion = async (body) => {
  const data = await fetchAPI(METHOD.POST, PROMOTION.GET, body);
  return data;
};

export const UsePayback = async () => {
  const data = await fetchAPI(METHOD.POST, PROMOTION.PAYBACK);
  return data;
};

export const UseCheckAmountOfCashBackAndPayBack = async (body) => {
  const data = await fetchAPI(METHOD.POST, PROMOTION.CHECK_AMOUNT_OF_PAYBACK_AND_CASHBACK, body);
  return data;
};
