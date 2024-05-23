import { Injectable } from '@nestjs/common';
import qs from 'qs';
import { Agent, request, setGlobalDispatcher } from 'undici';
import { IAccessToken } from '../../shared/interfaces';
import { NodeConfigService } from '../../shared/services';

@Injectable()
export class AuthService {
  private readonly authServerUrl: string;

  private readonly realm: string;

  private readonly clientId: string;

  private readonly clientSecret: string;

  private readonly scope: string;

  private readonly responseType: string;

  private readonly loginUrl: string;

  private readonly tokenUrl: string;

  private readonly logoutUrl: string;

  private readonly redirectUrl: string;

  constructor(private readonly nodeConfig: NodeConfigService) {
    this.authServerUrl = this.nodeConfig.config.get('keycloak.authServerUrl');
    this.realm = this.nodeConfig.config.get('keycloak.realm');
    this.clientId = this.nodeConfig.config.get('keycloak.clientId');
    this.clientSecret = this.nodeConfig.config.get('keycloak.clientSecret');
    this.scope = this.nodeConfig.config.get('keycloak.scope');
    this.responseType = this.nodeConfig.config.get('keycloak.responseType');
    this.loginUrl = this.nodeConfig.config.get('keycloak.loginUrl');
    this.tokenUrl = this.nodeConfig.config.get('keycloak.tokenUrl');
    this.logoutUrl = this.nodeConfig.config.get('keycloak.logoutUrl');
    this.redirectUrl = this.nodeConfig.config.get('keycloak.redirectUrl');
  }

  public login(): { url?: string; statusCode?: number } {
    const params = qs.stringify({
      client_id: this.clientId,
      response_type: this.responseType,
      scope: this.scope,
      redirect_uri: this.redirectUrl,
    });

    return { url: `${this.loginUrl}?${params}` };
  }

  public async getAccessToken(code: string): Promise<IAccessToken> {
    const data = qs.stringify({
      grant_type: 'authorization_code',
      client_id: this.clientId,
      client_secret: this.clientSecret,
      redirect_uri: this.redirectUrl,
      code,
    });

    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
      setGlobalDispatcher(
        new Agent({
          connect: {
            rejectUnauthorized: false,
          },
        }),
      );
    }

    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };

    const { body } = await request(this.tokenUrl, {
      headers,
      body: data,
      method: 'POST',
    });

    return body.json() as Promise<IAccessToken>;
  }

  public async refreshToken(refresh_token: string): Promise<IAccessToken> {
    const data = qs.stringify({
      grant_type: 'refresh_token',
      client_id: this.clientId,
      client_secret: this.clientSecret,
      redirect_uri: this.redirectUrl,
      refresh_token,
    });

    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };

    const { body } = await request(this.tokenUrl, {
      headers,
      body: data,
      method: 'POST',
    });

    return body.json() as Promise<IAccessToken>;
  }

  public async logout(refresh_token: string): Promise<void> {
    const data = qs.stringify({
      client_id: this.clientId,
      client_secret: this.clientSecret,
      refresh_token,
    });

    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };

    await request(this.logoutUrl, {
      headers,
      body: data,
      method: 'POST',
    });
  }
}
