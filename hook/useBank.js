import { fetchPaymentAPI } from '@/lib/fetcher';
import { METHOD, BANK } from '@/lib/endpoint';

export const UseWithdrawMoney = async (body) => {
  const data = await fetchAPI(METHOD.POST, BANK.WITHDRAW_MONEY, body);
  return data;
};

export const UseBankHistory = async (body) => {
  const data = await fetchAPI(METHOD.POST, BANK.GET_HISTORY, body);
  return data;
};
