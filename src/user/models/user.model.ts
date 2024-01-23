import { ApiProperty } from '@nestjs/swagger';
import { IKeycloakUser } from '../../shared/interfaces';
import { Field, ID, Int, InterfaceType, ObjectType } from '@nestjs/graphql';

@InterfaceType()
export abstract class UserAccessProp {
  @Field(() => Boolean)
  manageGroupMembership: boolean;

  @Field(() => Boolean)
  view: boolean;

  @Field(() => Boolean)
  mapRoles: boolean;

  @Field(() => Boolean)
  impersonate: boolean;

  @Field(() => Boolean)
  manage: boolean;
}

@ObjectType()
export class UserModel implements IKeycloakUser {
  @ApiProperty()
  @Field(() => ID)
  public id: string;

  @ApiProperty()
  @Field(() => Int)
  public createdTimestamp: number;

  @ApiProperty()
  @Field(() => String)
  public username: string;

  @ApiProperty()
  @Field(() => Boolean)
  public enabled: boolean;

  @ApiProperty()
  @Field(() => Boolean)
  public totp: boolean;

  @ApiProperty()
  @Field(() => String)
  public email: string;

  @ApiProperty()
  @Field(() => Boolean)
  public emailVerified: boolean;

  @ApiProperty()
  @Field(() => String)
  public firstName: string;

  @ApiProperty()
  @Field(() => String)
  public lastName: string;

  @ApiProperty()
  @Field(() => [String])
  public disableableCredentialTypes: any[];

  @ApiProperty()
  @Field(() => [String])
  public requiredActions: string[];

  @ApiProperty()
  @Field(() => Int)
  public notBefore: number;

  @ApiProperty()
  @Field(() => UserAccessProp)
  public access: UserAccessProp;

  constructor(data: IKeycloakUser) {
    ({
      access: this.access,
      createdTimestamp: this.createdTimestamp,
      disableableCredentialTypes: this.disableableCredentialTypes,
      email: this.email,
      emailVerified: this.emailVerified,
      enabled: this.enabled,
      firstName: this.firstName,
      id: this.id,
      lastName: this.lastName,
      notBefore: this.notBefore,
      requiredActions: this.requiredActions,
      totp: this.totp,
      username: this.username,
    } = data);
  }
}
