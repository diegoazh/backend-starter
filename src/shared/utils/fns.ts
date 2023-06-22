import { Dispatcher } from 'undici';

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
    throw body?.error;
  }

  return body;
}
