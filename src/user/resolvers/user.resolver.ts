import { Args, Context, ID, Int, Query, Resolver } from '@nestjs/graphql';
import { Resource, Scopes } from 'nest-keycloak-connect';
import { AppResources, AppScopes } from '../../shared/constants';
import { UserModel } from '../models';
import { UserService } from '../services/user.service';
import { Request } from 'express';

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
  @Query(() => UserModel, { description: 'Returns a user' })
  public async user(
    @Args('id', { type: () => ID }) id: string,
    @Context('req') req: Request,
  ): Promise<UserModel> {
    const { authorization } = req.headers;

    return this.userService.findById(id, authorization);
  }

  @Scopes(AppScopes.READ)
  @Query(() => Int, {
    description: 'Returns the total count of all users',
  })
  public async usersCount(@Context('req') req: Request): Promise<number> {
    const { authorization } = req.headers;
    const { count } = await this.userService.count(authorization);

    return count;
  }
}
