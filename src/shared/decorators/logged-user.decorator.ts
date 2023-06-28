import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { LoggedUserModel } from '../../user/models';
import { IKeycloakLoggedUserEntity } from '../interfaces';

export const LoggedUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as IKeycloakLoggedUserEntity;
    return new LoggedUserModel(user);
  },
);
