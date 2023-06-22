export interface IAccessToken {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  refresh_token: string;
  token_type: string;
  'not-before-policy': number;
  session_state: string;
  scope: string;
}

export interface IKeycloakUser {
  id: string;

  createdTimestamp: number;

  username: string;

  enabled: boolean;

  totp: boolean;

  email: string;

  emailVerified: boolean;

  firstName: string;

  lastName: string;

  disableableCredentialTypes: any[]; // TODO: fix this any type

  requiredActions: any[];

  notBefore: number;

  access: {
    manageGroupMembership: boolean;
    view: boolean;
    mapRoles: boolean;
    impersonate: boolean;
    manage: boolean;
  };
}

export interface IKeycloakLoggedUserEntity {
  exp: number;
  iat: number;
  auth_time: number;
  jti: string;
  iss: string;
  aud: string;
  sub: string;
  typ: string;
  azp: string;
  session_state: string;
  acr: string;
  'allowed-origins': string[];
  realm_access: {
    roles: string[];
  };
  resource_access: { [key: string]: { roles: string[] } };
  scope: string;
  sid: string;
  email_verified: boolean;
  name: string;
  preferred_username: string;
  given_name: string;
  family_name: string;
}

export interface IKeycloakUserQuery {
  briefRepresentation?: boolean;
  email?: string;
  emailVerified?: boolean;
  enabled?: boolean;
  exact?: boolean;
  first?: number;
  firstName?: string;
  idpAlias?: string;
  idpUserId?: string;
  lastName?: string;
  max?: number;
  q?: string;
  search?: string;
  username?: string;
}
