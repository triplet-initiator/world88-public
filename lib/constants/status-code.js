// 1xx = AuthenticationError
// 2xx = PermissionError
// 3xx = ValidationErorr
// 999 = SomethingsError
// 11000 = Mongo Error
export const STATUS_CODE = {
  Success: 0,
  PartnerIdNotFound: 1000,
  SignatureNotFound: 1001,
  SignatureMismatch: 1002,
  YourKeyIsNotActive: 1003,
  UserNotFound: 1004,
  UserSuspended: 1005,
  BalanceInsufficientFunds: 1006,
  PlatformIsInactive: 1007,
  PlatformIsMaintenancing: 1008,
  InvalidRequest: 1010,
  RequestTimedOut: 1011,

  TokenExpired: 1100,
  TokenMissing: 1101,
  TokenInvalidSignature: 1102,
  DuplicateUsername: 1103,
  UsernameOrPasswordIncorrect: 1104,
  NotFoundRefId: 1105,
  DuplicateBankAccount: 1199,

  YourPaymentGatewayIsInactive: 1201,
  WithdrawPending: 1202,
  BalanceInsufficient: 1203,
  EnterMinimumWithdrawalAmount: 1204,
  WithdrawalAmountExceedsTheLimit: 1205,
  DepositTypeInvalid: 1206,
  PasswordMismatch: 1207,
  OldPasswordMismatch: 1208,

  PromotionIsFullOfUsers: 1300,
  UsersAlreadyHasPromotion: 1301,
  AmountNotReachThreshold: 1302,
  PromotionNotFound: 1303,
  BalanceMustBeLessThanFive: 1304,
  TodayDepositNotFound: 1305,
  ReceivedThisPromotion: 1306,
  WinloseNotFound: 1307,
  ReceivedPromotionToday: 1308,
  PlayedToday: 1309,

  Maintenance: 2000,
  InternalServerError: 9999,
};

export const LOGOUT_CODE = [
  STATUS_CODE.TokenExpired,
  STATUS_CODE.TokenInvalid,
  STATUS_CODE.TokenMissing,
];
