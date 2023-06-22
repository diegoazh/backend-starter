import { IKeycloakLoggedUserEntity } from '../../shared/interfaces';

export class LoggedUserEntity implements IKeycloakLoggedUserEntity {
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

  realm_access: { roles: string[] };

  resource_access: { [key: string]: { roles: string[] } };

  scope: string;

  sid: string;

  email_verified: boolean;

  name: string;

  preferred_username: string;

  given_name: string;

  family_name: string;

  constructor(data: IKeycloakLoggedUserEntity) {
    ({
      'allowed-origins': this['allowed-origins'],
      acr: this.acr,
      aud: this.aud,
      auth_time: this.auth_time,
      azp: this.azp,
      email_verified: this.email_verified,
      exp: this.exp,
      family_name: this.family_name,
      given_name: this.given_name,
      iat: this.iat,
      iss: this.iss,
      jti: this.jti,
      name: this.name,
      preferred_username: this.preferred_username,
      realm_access: this.realm_access,
      resource_access: this.resource_access,
      scope: this.scope,
      session_state: this.session_state,
      sid: this.sid,
      sub: this.sub,
      typ: this.typ,
    } = data);
  }

  get id(): string {
    return this.sub;
  }
}
