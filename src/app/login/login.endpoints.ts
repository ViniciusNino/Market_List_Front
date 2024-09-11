export const LOGIN = {
  POST_LOGIN: 'api/auth/login',
  POST_CREATE_ACCOUNT: 'api/auth/register',
  POST_SEND_EMAIL_PASSWORD: 'api/Auth/send-verification-token',
  POST_SEND_EMAIL_VERIFICATION: 'api/auth/send-email-verification-token',
  GET_NATIONALITYS: 'api/auth/nationality',
  GET_COUNTRY_CREATE_ACCOUNT: 'api/countries',
  GET_VALIDATE_VERIFICATION_TOKEN: 'api/auth/validate-verification-token/{0}',
  GET_VALIDATE_EMAIL_VERIFICATION_TOKEN: 'api/auth/validate-email-verification-token/{0}',
  PATCH_UPDATE_PASSWORD: 'api/auth/update-password/{0}'
};
