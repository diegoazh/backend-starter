import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Public, Resource, Scopes } from 'nest-keycloak-connect';
import { ProductEntity } from '../../models';
import { AppResources, AppScopes } from '../../shared/constants';
import { ProductQueryInput } from '../../shared/graphql/inputs';
import { ProductService } from '../services/product.service';
import { CreateProductDto, PatchProductDto, UpdateProductDto } from '../dtos';
import { LoggedUser } from '../../shared/decorators';
import { LoggedUserModel } from '../../user/models';

@Resource(AppResources.PRODUCT)
@Resolver(() => ProductEntity)
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Public()
  @Scopes(AppScopes.READ)
  @Query(() => [ProductEntity]!, { description: 'Returns a list of products' })
  public async products(
    @Args('query', { nullable: true })
    query?: ProductQueryInput,
  ): Promise<ProductEntity[]> {
    return this.productService.find(query);
  }

  @Public()
  @Scopes(AppScopes.READ)
  @Query(() => ProductEntity, {
    description:
      'Returns the product that match with the given id or NULL if nothing matches',
  })
  public async product(@Args('id') id: string): Promise<ProductEntity | null> {
    return this.productService.findById(id);
  }

  @Public()
  @Scopes(AppScopes.READ)
  @Query(() => Int, {
    description: 'Returns the total count of all products by criteria',
  })
  public async productsCount(): Promise<number> {
    const { count } = await this.productService.count();

    return count;
  }

  @Public()
  @Scopes(AppScopes.CREATE)
  @Mutation(() => ProductEntity, {
    description: 'Create and return a new product',
  })
  public async createProduct(
    @Args('createProductDto') data: CreateProductDto,
    @LoggedUser() user: LoggedUserModel,
  ): Promise<ProductEntity> {
    return this.productService.create(data, user);
  }

  @Public()
  @Scopes(AppScopes.UPDATE)
  @Mutation(() => ProductEntity, {
    description: 'Overwrite and return the updated product',
  })
  public async overwriteProduct(
    @Args('productId') id: string,
    @Args('updateProductDto') data: UpdateProductDto,
    @LoggedUser() user: LoggedUserModel,
  ): Promise<ProductEntity> {
    return this.productService.overwrite(id, data, user);
  }

  @Public()
  @Scopes(AppScopes.UPDATE)
  @Mutation(() => ProductEntity, {
    description: 'Update and return the updated product',
  })
  public async updateProduct(
    @Args('productId') id: string,
    @Args('patchProductDto') data: PatchProductDto,
    @LoggedUser() user: LoggedUserModel,
  ): Promise<ProductEntity> {
    return this.productService.update(id, data, user);
  }

  @Public()
  @Scopes(AppScopes.DELETE)
  @Mutation(() => ProductEntity, {
    description: 'Remove the product if exist or return null otherwise',
  })
  public async removeProduct(
    @Args('productId') id: string,
    @LoggedUser() user: LoggedUserModel,
  ): Promise<{ deleted: number }> {
    return this.productService.remove(id, user);
  }
}
