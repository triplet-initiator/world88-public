import { fetchPaymentAPI } from '@/lib/fetcher';
import { METHOD, PAYMENT } from '@/lib/endpoint';

export const UseDepositPaymentGatewayQr = async (body) => {
  const data = await fetchPaymentAPI(METHOD.POST, PAYMENT.DEPOSIT_PAYMENT_GATEWAY_QR, body);
  return data;
};

export const UseDepositPaymentGatewayP2P = async (body) => {
  const data = await fetchPaymentAPI(METHOD.POST, PAYMENT.DEPOSIT_PAYMENT_GATEWAY_P2P, body);
  return data;
};

export const UseWithdrawPaymentGateway = async (body) => {
  const data = await fetchPaymentAPI(METHOD.POST, PAYMENT.WITHDRAW_PAYMENT_GATEWAY, body);
  return data;
};
