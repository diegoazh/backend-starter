/* eslint-disable @typescript-eslint/explicit-function-return-type -- js file */
const { faker } = require('@faker-js/faker');
// const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const data = require('../../.data/categories-and-products.json');
const stocks = require('../../.data/stocks.json');

module.exports = {
  up: async (queryInterface) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      let i = 5;
      // const users = [];
      const profiles = [];
      const tags = [];
      const categories = [];
      const comments = [];
      const posts = [];
      const postTags = [];
      const currentDate = new Date();

      // while (i--) {
      //   users.push({
      //     id: uuidv4(),
      //     email: faker.internet.email(),
      //     password: bcrypt.hashSync('secret', bcrypt.genSaltSync(10)),
      //     role: faker.helpers.arrayElement(['USER', 'ADMIN']),
      //     username: faker.internet.userName(),
      //     image: faker.image.avatar(),
      //     createdAt: faker.date.recent(10, currentDate),
      //     updatedAt: faker.date.recent(10, currentDate),
      //   });
      // }

      // console.info('users: ', JSON.stringify(users, null, 2));

      // await queryInterface.bulkInsert('Users', users, { transaction });

      i = 5;

      while (i--) {
        profiles.push({
          id: uuidv4(),
          bio: faker.lorem.paragraphs(1),
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          userId: uuidv4(),
          createdAt: faker.date.recent({ days: 10, refDate: currentDate }),
          updatedAt: faker.date.recent({ days: 10, refDate: currentDate }),
        });
      }

      console.info('profiles: ', JSON.stringify(profiles, null, 2));

      await queryInterface.bulkInsert('Profiles', profiles, { transaction });

      i = 5;

      while (i--) {
        tags.push({
          id: uuidv4(),
          name: faker.lorem.word(),
          createdAt: faker.date.recent({ days: 10, refDate: currentDate }),
          updatedAt: faker.date.recent({ days: 10, refDate: currentDate }),
        });
      }

      console.info('tags: ', JSON.stringify(tags, null, 2));

      await queryInterface.bulkInsert('Tags', tags, { transaction });

      i = 5;

      while (i--) {
        categories.push({
          id: uuidv4(),
          name: faker.lorem.word(),
          createdAt: faker.date.recent({ days: 10, refDate: currentDate }),
          updatedAt: faker.date.recent({ days: 10, refDate: currentDate }),
        });
      }

      console.info('categories: ', JSON.stringify(categories, null, 2));

      await queryInterface.bulkInsert('Categories', categories, {
        transaction,
      });

      i = 25;

      while (i--) {
        const type = faker.helpers.arrayElement(['TEXT', 'GALLERY']);
        const images = [];

        while (type === 'GALLERY' && images.length < 5) {
          images.push(faker.image.urlLoremFlickr({ category: 'abstract' }));
        }

        posts.push({
          id: uuidv4(),
          title: faker.lorem.words(10),
          content: faker.lorem.paragraphs(1),
          type,
          mainImage: faker.image.urlLoremFlickr({ category: 'abstract' }),
          images: images.join('|'),
          published: true,
          categoryId:
            categories[faker.helpers.arrayElement([0, 1, 2, 3, 4])].id,
          authorId: profiles[faker.helpers.arrayElement([0, 1, 2, 3, 4])].id,
          createdAt: faker.date.recent({ days: 10, refDate: currentDate }),
          updatedAt: faker.date.recent({ days: 10, refDate: currentDate }),
        });
      }

      console.info('posts: ', JSON.stringify(posts, null, 2));

      await queryInterface.bulkInsert('Posts', posts, { transaction });

      posts.forEach((post) => {
        postTags.push({
          id: uuidv4(),
          postId: post.id,
          tagId: tags[faker.helpers.arrayElement([0, 1, 2, 3, 4])].id,
          createdAt: faker.date.recent({ days: 10, refDate: currentDate }),
          updatedAt: faker.date.recent({ days: 10, refDate: currentDate }),
        });

        comments.push({
          id: uuidv4(),
          content: faker.lorem.paragraphs(2),
          authorId: profiles[faker.helpers.arrayElement([0, 1, 2, 3, 4])].id,
          postId: post.id,
          createdAt: faker.date.recent({ days: 10, refDate: currentDate }),
          updatedAt: faker.date.recent({ days: 10, refDate: currentDate }),
        });
      });

      console.info('postTags: ', JSON.stringify(postTags, null, 2));

      await queryInterface.bulkInsert('PostsTags', postTags, { transaction });

      console.info('Comments', JSON.stringify(comments, null, 2));

      await queryInterface.bulkInsert('Comments', comments, { transaction });

      const productCategories = data.productCategories.map((category) => ({
        ...category,
        id: uuidv4(),
        createdAt: faker.date.recent({ days: 10, refDate: currentDate }),
        updatedAt: faker.date.recent({ days: 10, refDate: currentDate }),
      }));

      console.info(
        'ProductCategories',
        JSON.stringify(productCategories, null, 2),
      );

      await queryInterface.bulkInsert('ProductCategories', productCategories, {
        transaction,
      });

      const products = data.products.map((value) => {
        const product = { ...value };
        const foundCategory = productCategories.find(
          (category) =>
            category.name.toLowerCase() ===
            value.productCategoryId.toLowerCase(),
        );

        if (!foundCategory) {
          throw new Error(
            `loading products we can't found category [${value.productCategoryId}]`,
          );
        }

        product.productCategoryId = foundCategory.id;
        product.available = true;
        product.id = uuidv4();
        product.createdAt = faker.date.recent({
          days: 10,
          refDate: currentDate,
        });
        product.updatedAt = faker.date.recent({
          days: 10,
          refDate: currentDate,
        });

        return product;
      });

      console.info('Products', JSON.stringify(products, null, 2));

      await queryInterface.bulkInsert('Products', products, {
        transaction,
      });

      const StockTypes = ['ONSITE', 'ONLINE'];
      const onSiteStock = stocks.onSite.map((stock, index) => {
        const productStock = {
          ...stock,
          type: StockTypes[0],
          price: +stock.price,
        };

        const foundCategory = productCategories.find(
          (category) =>
            category.name.toLowerCase() ===
            stock.productCategoryId.toLowerCase(),
        );
        const foundProduct = products.find(
          (product) =>
            product.name.toLowerCase() === stock.productId.toLowerCase(),
        );

        if (!foundCategory) {
          throw new Error(
            `loading stock we can't found category [${stock.productCategoryId}] - [${stock.productId}] - [${index}]`,
          );
        }

        if (!foundProduct) {
          throw new Error(
            `loading stock we can't found product [${stock.productId}] - [${stock.productCategoryId}] - [${index}]`,
          );
        }

        productStock.productCategoryId = foundCategory.id;
        productStock.productId = foundProduct.id;
        productStock.id = uuidv4();
        productStock.createdAt = faker.date.recent({
          days: 10,
          refDate: currentDate,
        });
        productStock.updatedAt = faker.date.recent({
          days: 10,
          refDate: currentDate,
        });

        return productStock;
      });

      console.info('Stocks', JSON.stringify(onSiteStock, null, 2));

      await queryInterface.bulkInsert('Stocks', onSiteStock, {
        transaction,
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      global.console.error(error);
      throw error;
    }
  },
  down: async (queryInterface) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // await queryInterface.bulkDelete('Products');
      await queryInterface.bulkDelete('Comments');
      await queryInterface.bulkDelete('PostsTags');
      await queryInterface.bulkDelete('Posts');
      await queryInterface.bulkDelete('Tags');
      await queryInterface.bulkDelete('Categories');
      await queryInterface.bulkDelete('Profiles');
      // await queryInterface.bulkDelete('Users');

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      global.console.error(error);
      throw error;
    }
  },
};
/* eslint-enable @typescript-eslint/explicit-function-return-type */
