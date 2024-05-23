import {
  HttpException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Attributes, FindOptions, Model } from 'sequelize';
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
        description: errors['user_exception_not-found'],
      });
    default:
      return new InternalServerErrorException(error?.message, {
        cause: error,
        description: errors['exception_internal-server-error'],
      });
  }
}

export function buildPartialFindOptions<T extends Model>({
  pageIndex,
  pageSize,
}: {
  pageSize: number;
  pageIndex: number;
}): FindOptions<Attributes<T>> {
  const options: FindOptions<Attributes<T>> = {};

  if (pageSize) {
    options.limit = pageSize;
  }

  if (pageIndex != null) {
    options.offset = pageIndex * pageSize;
  }

  return options;
}
