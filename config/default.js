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
  user: {
    takeMax: 200,
  },
  profile: {
    takeMax: 200,
  },
  post: {
    takeMax: 200,
  },
  category: {
    takeMax: 200,
  },
  tag: {
    takeMax: 200,
  },
};
