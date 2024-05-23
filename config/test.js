module.exports = {
  gateway: {
    apiKey: '',
  },
  app: {
    port: 3000,
    hashPassword: 'something',
    jwtSecret: 'jwtSuperSecret',
  },
  keycloak: {
    authServerUrl: '',
    realm: '',
    clientId: '',
    clientSecret: '',
    scope: '',
    responseType: '',
    loginUrl: '',
    tokenUrl: '',
    logoutUrl: '',
    redirectUrl: '',
  },
};
