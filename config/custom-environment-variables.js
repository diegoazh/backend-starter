module.exports = {
  gateway: {
    apiKey: 'GATEWAY_API_KEY',
  },
  app: {
    port: 'APP_PORT',
    hashPassword: 'HASH_PASSWORD',
    jwtSecret: 'JWT_SECRET',
    cors: {
      origin: 'APP_CORS_ORIGIN',
    },
  },
  keycloak: {
    authServerUrl: 'KEYCLOAK_SERVER_URL',
    realm: 'KEYCLOAK_REALM',
    clientId: 'KEYCLOAK_CLIENT_ID',
    clientSecret: 'KEYCLOAK_CLIENT_SECRET',
    scope: 'KEYCLOAK_SCOPE',
    responseType: 'KEYCLOAK_RESPONSE_TYPE',
    loginUrl: 'KEYCLOAK_AUTH_URL',
    tokenUrl: 'KEYCLOAK_TOKEN_URL',
    logoutUrl: 'KEYCLOAK_LOGOUT_URL',
    redirectUrl: 'KEYCLOAK_REDIRECT_URL',
  },
};
