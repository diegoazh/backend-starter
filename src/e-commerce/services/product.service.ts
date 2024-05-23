import { GetSignedUrlConfig, Storage } from '@google-cloud/storage';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ProductCategoryEntity } from '../../models';
import { ProductEntity } from '../../models/product.entity';
import { IAppQueryString } from '../../shared/interfaces';
import { buildPartialFindOptions } from '../../shared/utils/fns';
import { CreateProductDto, PatchProductDto, UpdateProductDto } from '../dtos';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  private storage = new Storage();

  constructor(
    @InjectModel(ProductEntity)
    private readonly Product: typeof ProductEntity,
  ) {}

  public find(query: IAppQueryString = {}): Promise<ProductEntity[]> {
    const { pageSize = 0, pageIndex = 0, filter = {} } = query;

    this.logger.log(
      `pageSize: [${pageSize}], pageIndex: [${pageIndex}], filter: [${JSON.stringify(
        filter,
        null,
        2,
      )}]`,
    );

    return this.Product.findAll({
      ...buildPartialFindOptions<ProductEntity>({ pageSize, pageIndex }),
      where: {
        ...filter,
      },
      attributes: {
        exclude: [
          'author',
          'deletedAt',
          'productCategoryId',
          'size',
          'images',
          'status',
        ],
      },
      include: [{ model: ProductCategoryEntity }],
    });
  }

  public findById(id: string): Promise<ProductEntity | null> {
    this.logger.log(`id: [${id}]`);

    return this.Product.findByPk(id);
  }

  public async count(query: IAppQueryString = {}): Promise<{ count: number }> {
    const { filter } = query;

    this.logger.log(`filter: [${JSON.stringify(filter, null, 2)}]`);

    const count = await this.Product.count({
      where: {
        ...filter,
      },
    });

    return { count };
  }

  public create(data: CreateProductDto): Promise<ProductEntity> {
    return this.Product.create({
      ...data,
    });
  }

  public async overwrite(
    id: string,
    data: UpdateProductDto,
  ): Promise<ProductEntity> {
    const product = await this.findById(id);

    // TODO: use Object.keys over product to overwrite all its properties
    product.available = data.available;
    product.description = data.description;
    product.images = data.images;
    product.name = data.name;
    product.updatedAt = new Date();
    await product.save();

    return product;
  }

  public async update(
    id: string,
    data: PatchProductDto,
  ): Promise<ProductEntity> {
    const product = await this.findById(id);

    // TODO: use Object.keys over product to only update properties sent properties
    product.available = data?.available ?? product.available;
    product.description = data?.description ?? product.description;
    product.images = data?.images ?? product.images;
    product.name = data?.name ?? product.name;
    product.updatedAt = new Date();
    await product.save();

    return product;
  }

  public async remove(id: string): Promise<{ deleted: number }> {
    const product = await this.findById(id);

    await product.destroy();

    return { deleted: 1 };
  }

  public async generateV4UploadSignedUrl(
    fileName: string,
    bucketName: string,
  ): Promise<string> {
    // TODO: check if this implementation works
    // https://cloud.google.com/storage/docs/access-control/signing-urls-with-helpers?hl=es-419#storage-signed-url-object-nodejs
    // These options will allow temporary uploading of the file with outgoing
    // Content-Type: application/octet-stream header.
    const options: GetSignedUrlConfig = {
      version: 'v4',
      action: 'write',
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
      contentType: 'application/octet-stream',
    };

    // Get a v4 signed URL for uploading file
    const [url] = await this.storage
      .bucket(bucketName)
      .file(fileName)
      .getSignedUrl(options);

    console.log('Generated PUT signed URL:');
    console.log(url);
    console.log('You can use this URL with any user agent, for example:');
    console.log(
      "curl -X PUT -H 'Content-Type: application/octet-stream' " +
        `--upload-file my-file '${url}'`,
    );

    return url;
  }
}
