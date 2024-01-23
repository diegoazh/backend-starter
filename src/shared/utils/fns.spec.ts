import { Dispatcher } from 'undici';
import { keycloakResponseChecker } from './fns';

describe('Describing keycloakResponseChecker function', () => {
  let response: Dispatcher.ResponseData;

  it('should return a string when receive the response', async () => {
    // Arrange
    const bodyResult = { data: 'This is a test' };
    const bodyTxt = JSON.stringify(bodyResult);
    response = {
      body: {
        text: jest.fn(async () => bodyTxt),
      },
    } as any;

    // Act
    const result = await keycloakResponseChecker(response);

    // Assert
    expect(result).toEqual(bodyResult);
  });

  it('should return a trimmed string when receive the response', async () => {
    // Arrange
    const bodyResult = { data: 'This is a test' };
    const bodyTxt = `     ${JSON.stringify(bodyResult)}       `;
    response = {
      body: {
        text: jest.fn(async () => bodyTxt),
      },
    } as any;

    // Act
    const result = await keycloakResponseChecker(response);

    // Assert
    expect(result).toEqual(bodyResult);
  });

  it('should return the error when response contains an error key in its body', async () => {
    // Arrange
    const bodyResult = { error: 'This error is testing' };
    const bodyTxt = JSON.stringify(bodyResult);
    response = {
      body: {
        text: jest.fn(async () => bodyTxt),
      },
    } as any;
    let err = undefined;

    // Act
    try {
      await keycloakResponseChecker(response);
    } catch (error) {
      err = error;
    }

    // Assert
    expect(err?.message).toEqual(bodyResult.error);
  });

  it('should return undefined when response is empty', async () => {
    // Arrange
    response = {
      body: {
        text: jest.fn(async () => ''),
      },
    } as any;

    // Act
    const result = await keycloakResponseChecker(response);

    // Assert
    expect(result).toBeUndefined();
  });
});
