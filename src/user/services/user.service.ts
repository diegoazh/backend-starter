import { Injectable, Logger } from '@nestjs/common';
import qs from 'qs';
import { request } from 'undici';
import { IKeycloakUser, IKeycloakUserQuery } from '../../shared/interfaces';
import { NodeConfigService } from '../../shared/services/node-config.service';
import { keycloakResponseChecker } from '../../shared/utils';
import { CreateUserDto, PatchUserDto, UpdateUserDto } from '../dto';
import { UserModel } from '../models';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  private readonly authServerUrl: string;

  private readonly realm: string;

  private usersUrl: string;

  private defaultHeaders = { 'Content-Type': 'application/json' };

  constructor(private readonly nodeConfigService: NodeConfigService) {
    this.authServerUrl = this.nodeConfigService.config.get<string>(
      'keycloak.authServerUrl',
    );
    this.realm = this.nodeConfigService.config.get<string>('keycloak.realm');
    this.usersUrl = `${this.authServerUrl}/admin/realms/${this.realm}/users`;
  }

  public async find(authorization: string): Promise<UserModel[]> {
    try {
      const res = await request(this.usersUrl, {
        headers: { ...this.defaultHeaders, authorization },
      });
      const users = await keycloakResponseChecker<IKeycloakUser[]>(res);

      return users.map((user) => new UserModel(user));
    } catch (error) {
      this.logger.error(`USER_FIND: ${error}`);
      throw error;
    }
  }

  public async findById(
    id: string,
    authorization: string,
  ): Promise<UserModel | null> {
    try {
      const res = await request(`${this.usersUrl}/${id}`, {
        headers: { ...this.defaultHeaders, authorization },
      });
      const newUserData = await keycloakResponseChecker<IKeycloakUser>(res);

      return new UserModel(newUserData);
    } catch (error) {
      this.logger.error(`USER_FIND_BY_ID: ${error}`);
      throw error;
    }
  }

  public async findOne(
    userData: IKeycloakUserQuery,
    authorization: string,
  ): Promise<UserModel[]> {
    try {
      const query = qs.stringify(userData);
      this.logger.log(`Request URL: ${this.usersUrl}?${query}`);
      const res = await request(`${this.usersUrl}?${query}`, {
        headers: { ...this.defaultHeaders, authorization },
      });
      const result = await keycloakResponseChecker<IKeycloakUser[]>(res);

      return result.map((value) => new UserModel(value));
    } catch (error) {
      this.logger.error(`USER_FIND_ONE: ${error}`);
      throw error;
    }
  }

  public async count(authorization: string): Promise<{ count: number }> {
    try {
      const res = await request(`${this.usersUrl}/count`, {
        headers: { ...this.defaultHeaders, authorization },
      });
      const count = await keycloakResponseChecker<number>(res);

      return { count };
    } catch (error) {
      this.logger.error(`USER_COUNT: ${error}`);
      throw error;
    }
  }

  public async create(
    data: CreateUserDto,
    authorization: string,
  ): Promise<UserModel | null> {
    try {
      const { password, ...body } = data;
      let res = await request(this.usersUrl, {
        headers: { ...this.defaultHeaders, authorization },
        method: 'POST',
        body: JSON.stringify(body),
      });

      await keycloakResponseChecker(res);

      const user = await this.findOne(
        { email: body.email, username: body.username },
        authorization,
      );
      await this.updateCredentials(user[0].id, password, authorization);

      return user[0];
    } catch (error) {
      this.logger.error(`USER_CREATE: ${error}`);
      throw error;
    }
  }

  public async overwrite(
    id: string,
    data: UpdateUserDto,
    authorization: string,
  ): Promise<UserModel | null> {
    try {
      const savedUser = await this.findById(id, authorization);

      if (!savedUser) return savedUser;

      const url = `${this.usersUrl}/${id}`;
      const res = await request(url, {
        headers: { ...this.defaultHeaders, authorization },
        method: 'PUT',
        body: JSON.stringify(data),
      });

      await keycloakResponseChecker(res);

      return await this.findById(id, authorization);
    } catch (error) {
      this.logger.error(`USER_OVERWRITE: ${error}`);
      throw error;
    }
  }

  public async update(
    id: string,
    data: PatchUserDto,
    authorization: string,
  ): Promise<UserModel | null> {
    try {
      const savedUser = await this.findById(id, authorization);

      if (!savedUser) return savedUser;

      const url = `${this.usersUrl}/${id}`;
      const body: PatchUserDto = {};

      if (data.email) {
        body.email = data.email;
      }

      if (data.emailVerified != null) {
        body.emailVerified = data.emailVerified;
      }

      if (data.enabled != null) {
        body.enabled = data.enabled;
      }

      if (data.firstName) {
        body.firstName = data.firstName;
      }

      if (data.groups != null) {
        body.groups = [...data.groups];
      }

      if (data.requiredActions) {
        body.requiredActions = [...data.requiredActions];
      }

      if (data.lastName) {
        body.lastName = data.lastName;
      }

      if (data.username) {
        body.username = data.username;
      }

      const res = await request(url, {
        headers: { ...this.defaultHeaders, authorization },
        method: 'PUT',
        body: JSON.stringify(data),
      });

      await keycloakResponseChecker(res);

      return await this.findById(id, authorization);
    } catch (error) {
      this.logger.error(`USER_UPDATE: ${error}`);
      throw error;
    }
  }

  public async remove(id: string, authorization: string): Promise<void> {
    try {
      const url = `${this.usersUrl}/${id}`;
      const res = await request(url, {
        method: 'DELETE',
        headers: { ...this.defaultHeaders, authorization },
      });

      await keycloakResponseChecker(res);
    } catch (error) {
      this.logger.error(`USER_REMOVE: ${error}`);
      throw error;
    }
  }

  public async updateCredentials(
    id: string,
    password: string,
    authorization: string,
  ): Promise<void> {
    try {
      const reqBody = {
        temporary: true,
        type: 'password',
        value: password,
      };
      const res = await request(`${this.usersUrl}/${id}/reset-password`, {
        headers: { ...this.defaultHeaders, authorization },
        method: 'PUT',
        body: JSON.stringify(reqBody),
      });

      await keycloakResponseChecker(res);
    } catch (error) {
      this.logger.error(`USER_UPDATE_CREDENTIALS: ${error}`);
      console.error(error);
    }
  }
}
