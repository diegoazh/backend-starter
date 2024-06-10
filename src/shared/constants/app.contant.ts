export const AppResources = {
  USER: 'user',
  AUTH: 'auth',
  PRODUCT: 'product',
  PRODUCT_CATEGORY: 'product_category',
  STOCKS: 'stocks',
} as const;

export const AppScopes = {
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
} as const;

export const KeycloakResponseMessages = {
  USER_NOT_FOUND: 'User not found',
} as const;
