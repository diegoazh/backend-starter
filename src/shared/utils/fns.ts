import {
  HttpException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Dispatcher } from 'undici';
import errors from '../../../errors/errors_messages.json';
import { KeycloakResponseMessages } from '../constants/app.contant';

export async function keycloakResponseChecker<
  T extends
    | void
    | number
    | {
        [key: string | number | symbol]: any;
      } = void,
>(
  res: Dispatcher.ResponseData,
): Promise<T extends void ? void : T extends number ? number : T> {
  const bodyTxt = (await res.body.text()).trim();
  const body: any = bodyTxt ? JSON.parse(bodyTxt) : undefined;

  if (body?.error) {
    throw new Error(body?.error);
  }

  return body;
}

export function parseErrorsToHttpErrors(error: any): HttpException {
  if (error instanceof HttpException) {
    throw error;
  }

  switch (error.message) {
    case KeycloakResponseMessages.USER_NOT_FOUND:
      return new NotFoundException(error?.message, {
        cause: error,
        description: errors.user_not_found,
      });
    default:
      return new InternalServerErrorException(error?.message, {
        cause: error,
        description: errors.internal_server_error,
      });
  }
}
