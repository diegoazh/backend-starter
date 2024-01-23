import { Field, Int, InterfaceType, ObjectType } from '@nestjs/graphql';
import { IKeycloakLoggedUserEntity } from '../../shared/interfaces';

@InterfaceType()
export abstract class RealmAccessProp {
  @Field(() => [String]!)
  roles: string[];
}

@ObjectType()
export class LoggedUserModel implements IKeycloakLoggedUserEntity {
  @Field(() => Int)
  exp: number;

  @Field(() => Int)
  iat: number;

  @Field(() => Int)
  auth_time: number;

  @Field(() => String)
  jti: string;

  @Field(() => String)
  iss: string;

  @Field(() => String)
  aud: string;

  @Field(() => String)
  sub: string;

  @Field(() => String)
  typ: string;

  @Field(() => String)
  azp: string;

  @Field(() => String)
  session_state: string;

  @Field(() => String)
  acr: string;

  @Field(() => [String]!, { name: 'allowed_origins' })
  'allowed-origins': string[];

  @Field(() => RealmAccessProp)
  realm_access: RealmAccessProp;

  resource_access: { [key: string]: { roles: string[] } };

  @Field(() => String)
  scope: string;

  @Field(() => String)
  sid: string;

  @Field(() => Boolean)
  email_verified: boolean;

  @Field(() => String)
  name: string;

  @Field(() => String)
  preferred_username: string;

  @Field(() => String)
  given_name: string;

  @Field(() => String)
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

  @Field(() => String, {
    description:
      'the id of logged user. It was called id to be more intuitive but is the same as sub property',
  })
  get id(): string {
    return this.sub;
  }
}
