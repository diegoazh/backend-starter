module.exports = {
  gateway: {
    apiKey: '',
  },
  app: {
    port: 3000,
    hashPassword: 'something',
    jwtSecret: 'jwtSuperSecret',
    cors: {
      origin: '',
    },
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
