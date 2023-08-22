import { Test, TestingModule } from '@nestjs/testing';
import { request } from 'undici';
import { KeycloakResponseMessages } from '../../shared/constants';
import { NodeConfigService } from '../../shared/services/node-config.service';
import { UserService } from './user.service';

jest.mock('undici', () => {
  const original = jest.requireActual('undici');

  return {
    __esModule: true,
    ...original,
    request: jest.fn(),
  };
});

const nodeConfigServiceMock = {
  config: {
    get: jest.fn(() => 200),
  },
};

const users = [{ username: 'test', email: 'test@test.com' }];

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: NodeConfigService, useValue: nodeConfigServiceMock },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should request users to Keycloak when call find method', async () => {
    // Arrange
    (request as jest.Mock).mockImplementationOnce(async () => ({
      body: {
        text: jest.fn(async () => JSON.stringify(users)),
      },
    }));
    const auth = 'xxxXXXXxxxXXXXxxx';
    const expectedArgs = [
      '200/admin/realms/200/users',
      { headers: { 'Content-Type': 'application/json', authorization: auth } },
    ];

    // Act
    await service.find(auth);

    // Assert
    expect(request).toHaveBeenCalledTimes(1);
    expect(request).toHaveBeenCalledWith(...expectedArgs);
  });

  it('should request a user to Keycloak when call findById method', async () => {
    // Arrange
    const id = 'abcd-efgh-ijkl-mnop';
    (request as jest.Mock).mockImplementationOnce(async () => ({
      body: {
        text: jest.fn(async () => JSON.stringify(users[0])),
      },
    }));
    const auth = 'xxxXXXXxxxXXXXxxx';
    const expectedArgs = [
      `200/admin/realms/200/users/${id}`,
      {
        headers: {
          'Content-Type': 'application/json',
          authorization: auth,
        },
      },
    ];

    // Act
    await service.findById(id, auth);

    // Assert
    expect(request).toHaveBeenCalledTimes(1);
    expect(request).toHaveBeenCalledWith(...expectedArgs);
  });

  it('should throw an error when any user was found', async () => {
    // Arrange
    const id = 'abcd-efgh-ijkl-mnop';
    (request as jest.Mock).mockImplementationOnce(async () => ({
      statusCode: 404,
      body: {
        text: jest.fn(async () => JSON.stringify({ error: 'User not found' })),
      },
    }));
    const auth = 'xxxXXXXxxxXXXXxxx';
    const expectedArgs = [
      `200/admin/realms/200/users/${id}`,
      {
        headers: {
          'Content-Type': 'application/json',
          authorization: auth,
        },
      },
    ];
    let err;

    // Act
    try {
      await service.findById(id, auth);
    } catch (error) {
      err = error;
    }

    // Assert
    expect(request).toHaveBeenCalledTimes(1);
    expect(request).toHaveBeenCalledWith(...expectedArgs);
    expect(err?.message).toBe(KeycloakResponseMessages.USER_NOT_FOUND);
  });

  // it('should call user.findOne with args when call findOne method', async () => {
  //   // Arrange
  //   const data: UserWithoutPassword = {
  //     username: 'test',
  //     email: 'test@test.com',
  //   };
  //   const expectedArgs = {
  //     where: { ...data },
  //     include: [
  //       {
  //         model: ProfileEntity,
  //         attributes: {
  //           exclude: ['userId'],
  //         },
  //       },
  //       {
  //         model: PostEntity,
  //         attributes: {
  //           exclude: ['userId'],
  //         },
  //       },
  //     ],
  //   };

  //   // Act
  //   service.findOne(data);

  //   // Assert
  //   expect(user.findOne).toHaveBeenCalledTimes(1);
  //   expect(user.findOne).toHaveBeenCalledWith(expectedArgs);
  // });

  // it('should call user.count with arguments when call count method', async () => {
  //   // Arrange
  //   const args = { filter: { username: 'John' } };
  //   const expectedArgs = { where: { ...args.filter } };

  //   // Act
  //   await service.count(args as any);

  //   // Assert
  //   expect(user.count).toHaveBeenCalledTimes(1);
  //   expect(user.count).toHaveBeenCalledWith(expectedArgs);
  // });

  // it('should call prisma user.create with arguments when call create method', async () => {
  //   // Arrange
  //   const userData: CreateUserDto = {
  //     email: 'test@test.com',
  //     password: 'secret',
  //     username: 'funnyName',
  //   };
  //   const expectedArgs = {
  //     ...userData,
  //     password: userData.password.split('').reverse().join(''),
  //     role: UserRole.USER,
  //   };

  //   // Act
  //   await service.create(userData);

  //   // Assert
  //   expect(bcrypt.hashPassword).toHaveBeenCalledTimes(1);
  //   expect(bcrypt.hashPassword).toHaveBeenCalledWith(userData.password);
  //   expect(user.create).toHaveBeenCalledTimes(1);
  //   expect(user.create).toHaveBeenCalledWith(expectedArgs);
  // });

  // it('should call save instance method with arguments and update all user data when call overwrite method', async () => {
  //   // Arrange
  //   const id = 'abcd-efgh-ijkl-mnop';
  //   const oldUser = {
  //     id,
  //     email: 'old@test.com',
  //     password: 'oldSecret',
  //     username: 'oldFunnyName',
  //     createdAt: '12/12/12T10:30:23',
  //     updatedAt: '12/12/12T10:30:23',
  //     save: jest.fn(),
  //   };
  //   const userData: UpdateUserDto = {
  //     email: 'test@test.com',
  //     password: 'newSecret',
  //     username: 'funnyName',
  //   };
  //   (user.findByPk as any).mockReturnValue(oldUser);

  //   // Act
  //   await service.overwrite(id, userData);

  //   // Assert
  //   expect(oldUser.email).toBe(userData.email);
  //   expect(oldUser.username).toBe(userData.username);
  //   expect(oldUser.password).toBe(
  //     userData.password.split('').reverse().join(''),
  //   );
  //   expect(oldUser.save).toHaveBeenCalledTimes(1);
  //   expect(oldUser.save).toHaveBeenCalledWith();
  // });

  // it('should call save instance method with arguments and update the passed properties of the user data when call update method', async () => {
  //   // Arrange
  //   const id = 'abcd-efgh-ijkl-mnop';
  //   const password = 'oldSecret';
  //   const username = 'oldFunnyName';
  //   const oldUser = {
  //     id,
  //     email: 'old@test.com',
  //     password,
  //     username,
  //     createdAt: '12/12/12T10:30:23',
  //     updatedAt: '12/12/12T10:30:23',
  //     save: jest.fn(),
  //   };
  //   const userData: PatchUserDto = {
  //     email: 'test@test.com',
  //   };
  //   jest.spyOn(service, 'findById');
  //   (user.findByPk as any).mockReturnValue(oldUser);

  //   // Act
  //   await service.update(id, userData);

  //   // Assert
  //   expect(service.findById).toHaveBeenCalledTimes(1);
  //   expect(service.findById).toHaveBeenCalledWith(id);
  //   expect(oldUser.email).toBe(userData.email);
  //   expect(oldUser.username).toBe(username);
  //   expect(oldUser.password).toBe(password);
  //   expect(oldUser.save).toHaveBeenCalledTimes(1);
  //   expect(oldUser.save).toHaveBeenCalledWith();
  // });

  // it('should call save instance method with arguments and not update the user data when call update method with empty data', async () => {
  //   // Arrange
  //   const id = 'abcd-efgh-ijkl-mnop';
  //   const email = 'old@test.com';
  //   const password = 'oldSecret';
  //   const username = 'oldFunnyName';
  //   const oldUser = {
  //     id,
  //     email,
  //     password,
  //     username,
  //     createdAt: '12/12/12T10:30:23',
  //     updatedAt: '12/12/12T10:30:23',
  //     save: jest.fn(),
  //   };
  //   const userData: PatchUserDto = {
  //     email: '',
  //   };
  //   jest.spyOn(service, 'findById');
  //   (user.findByPk as any).mockReturnValue(oldUser);

  //   // Act
  //   await service.update(id, userData);

  //   // Assert
  //   expect(service.findById).toHaveBeenCalledTimes(1);
  //   expect(service.findById).toHaveBeenCalledWith(id);
  //   expect(oldUser.email).toBe(email);
  //   expect(oldUser.username).toBe(username);
  //   expect(oldUser.password).toBe(password);
  //   expect(oldUser.save).toHaveBeenCalledTimes(1);
  //   expect(oldUser.save).toHaveBeenCalledWith();
  // });

  // it('should call user.destroy with arguments when call remove method', async () => {
  //   // Arrange
  //   const id = 'abcd-efgh-ijkl-mnop';
  //   const oldUser = {
  //     id,
  //     email: 'old@test.com',
  //     password: 'oldSecret',
  //     username: 'oldFunnyName',
  //     createdAt: '12/12/12T10:30:23',
  //     updatedAt: '12/12/12T10:30:23',
  //   };
  //   const expectedArgs = { where: { id } };
  //   jest.spyOn(service, 'findById');
  //   (user.findByPk as any).mockReturnValue(oldUser);

  //   // Act
  //   await service.remove(id);

  //   // Assert
  //   expect(service.findById).toHaveBeenCalledTimes(1);
  //   expect(service.findById).toHaveBeenCalledWith(id);
  //   expect(user.destroy).toHaveBeenCalledTimes(1);
  //   expect(user.destroy).toHaveBeenCalledWith(expectedArgs);
  // });
});
