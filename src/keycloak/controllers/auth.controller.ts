import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Redirect,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiFoundResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Public, Resource } from 'nest-keycloak-connect';
import { IAccessToken } from '../../shared/interfaces';
import { RefreshTokenDto } from '../dtos';
import { AuthService } from '../services/auth.service';

@ApiTags('Auth controller')
@Resource('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiFoundResponse()
  @HttpCode(HttpStatus.FOUND)
  @Get('login')
  @Redirect('', HttpStatus.FOUND)
  @Public()
  public login(): { url?: string; statusCode?: number } {
    return this.authService.login();
  }

  @ApiOkResponse()
  @Get('callback')
  @Public()
  public callback(@Query('code') code: string): Promise<IAccessToken> {
    return this.authService.getAccessToken(code);
  }

  @ApiCreatedResponse()
  @Post('refresh-token')
  @Public()
  public refreshToken(@Body() token: RefreshTokenDto): Promise<IAccessToken> {
    return this.authService.refreshToken(token.refresh_token);
  }

  @ApiNoContentResponse()
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Public()
  public logout(@Body() token: RefreshTokenDto): Promise<void> {
    return this.authService.logout(token.refresh_token);
  }
}
