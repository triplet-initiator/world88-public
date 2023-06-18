import { fetchAPI } from '@/lib/fetcher';
import { METHOD, STATEMENT } from '@/lib/endpoint';

export const UseGetStatement = async () => {
  const data = await fetchAPI(METHOD.GET, STATEMENT.GET_STATEMENT);
  return data;
};

export const UseCancelDeposit = async (body) => {
  const data = await fetchAPI(METHOD.PATCH, STATEMENT.CANCEL_DEPOSIT, body);
  return data;
};

export const UseStatementHistory = async (body) => {
  const data = await fetchAPI(METHOD.POST, STATEMENT.STATEMENT_HISTORY, body);
  return data;
};
