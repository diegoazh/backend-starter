import {
  Args,
  Context,
  ID,
  Int,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { Resource, Scopes } from 'nest-keycloak-connect';
import { AppResources, AppScopes } from '../../shared/constants';
import { UserModel } from '../models';
import { UserService } from '../services/user.service';
import { Request } from 'express';
import { CreateUserDto } from '../dto';

@Resource(AppResources.USER)
@Resolver(() => UserModel)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Scopes(AppScopes.READ)
  @Query(() => [UserModel]!, { description: 'Returns a list of users' })
  public async users(@Context('req') req: Request): Promise<UserModel[]> {
    const { authorization } = req.headers;

    return this.userService.find(authorization);
  }

  @Scopes(AppScopes.READ)
  @Query(() => UserModel, {
    description: 'Returns the user that match with the provided id',
  })
  public async user(
    @Args('id', { type: () => ID }) id: string,
    @Context('req') req: Request,
  ): Promise<UserModel> {
    const { authorization } = req.headers;

    return this.userService.findById(id, authorization);
  }

  @Scopes(AppScopes.READ)
  @Query(() => Int, {
    description: 'Returns the total count of all users by criteria',
  })
  public async usersCount(@Context('req') req: Request): Promise<number> {
    const { authorization } = req.headers;
    const { count } = await this.userService.count(authorization);

    return count;
  }

  @Scopes(AppScopes.CREATE)
  @Mutation(() => UserModel, { description: 'Create and return a new user' })
  public async createUser(
    @Context('req') req: Request,
    @Args('createUserDto') data: CreateUserDto,
  ): Promise<UserModel> {
    const { authorization } = req.headers;

    return this.userService.create(data, authorization);
  }
}
