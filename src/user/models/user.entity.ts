import { ApiProperty } from '@nestjs/swagger';
import { IKeycloakUser } from '../../shared/interfaces';

export class UserEntity implements IKeycloakUser {
  @ApiProperty()
  public id: string;

  @ApiProperty()
  public createdTimestamp: number;

  @ApiProperty()
  public username: string;

  @ApiProperty()
  public enabled: boolean;

  @ApiProperty()
  public totp: boolean;

  @ApiProperty()
  public email: string;

  @ApiProperty()
  public emailVerified: boolean;

  @ApiProperty()
  public firstName: string;

  @ApiProperty()
  public lastName: string;

  @ApiProperty()
  public disableableCredentialTypes: any[];

  @ApiProperty()
  public requiredActions: string[];

  @ApiProperty()
  public notBefore: number;

  @ApiProperty()
  public access: {
    manageGroupMembership: boolean;
    view: boolean;
    mapRoles: boolean;
    impersonate: boolean;
    manage: boolean;
  };

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
