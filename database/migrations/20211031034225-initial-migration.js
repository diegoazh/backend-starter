/* eslint-disable @typescript-eslint/explicit-function-return-type -- js file */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // const userRoles = ['USER', 'ADMIN'];
      const PostTypes = ['TEXT', 'GALLERY'];
      const ProductSize = ['BIG', 'MEDIUM', 'SMALL'];
      const ProductStatus = ['PENDING', 'IN_PROGRESS', 'FINISHED'];
      const StockTypes = ['ONSITE', 'ONLINE'];

      // await queryInterface.createTable(
      //   'Users',
      //   {
      //     id: {
      //       type: Sequelize.UUID,
      //       defaultValue: Sequelize.UUIDV4,
      //       primaryKey: true,
      //       allowNull: false,
      //     },
      //     email: {
      //       type: Sequelize.STRING,
      //       allowNull: false,
      //       unique: true,
      //     },
      //     password: {
      //       type: Sequelize.STRING,
      //       allowNull: false,
      //     },
      //     role: {
      //       type: Sequelize.ENUM,
      //       values: userRoles,
      //       default: userRoles[0],
      //     },
      //     username: {
      //       type: Sequelize.STRING,
      //       allowNull: true,
      //     },
      //     image: {
      //       type: Sequelize.STRING,
      //       allowNull: true,
      //     },
      //     createdAt: {
      //       allowNull: false,
      //       type: Sequelize.DATE,
      //     },
      //     updatedAt: {
      //       allowNull: false,
      //       type: Sequelize.DATE,
      //     },
      //     deletedAt: {
      //       allowNull: true,
      //       type: Sequelize.DATE,
      //     },
      //   },
      //   { transaction },
      // );

      await queryInterface.createTable(
        'Profiles',
        {
          id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
            allowNull: false,
          },
          image: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          bio: {
            type: Sequelize.TEXT,
            allowNull: true,
          },
          firstName: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          lastName: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          userId: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
          },
          createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },
          updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },
          deletedAt: {
            allowNull: true,
            type: Sequelize.DATE,
          },
        },
        { transaction },
      );

      await queryInterface.createTable(
        'Categories',
        {
          id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
            allowNull: false,
          },
          name: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          parentId: {
            type: Sequelize.UUID,
            references: {
              model: 'Categories',
              key: 'id',
            },
            onDelete: 'SET NULL',
          },
          createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },
          updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },
          deletedAt: {
            allowNull: true,
            type: Sequelize.DATE,
          },
        },
        { transaction },
      );

      await queryInterface.createTable(
        'Tags',
        {
          id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
            allowNull: false,
          },
          name: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },
          updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },
          deletedAt: {
            allowNull: true,
            type: Sequelize.DATE,
          },
        },
        { transaction },
      );

      await queryInterface.createTable(
        'Posts',
        {
          id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
            allowNull: false,
          },
          title: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          content: {
            type: Sequelize.TEXT,
            allowNull: false,
          },
          mainImage: {
            type: Sequelize.STRING(1500),
            allowNull: false,
          },
          images: {
            type: Sequelize.TEXT,
            allowNull: true,
          },
          type: {
            type: Sequelize.ENUM,
            values: PostTypes,
            default: PostTypes[0],
          },
          published: {
            type: Sequelize.BOOLEAN,
            default: false,
          },
          authorId: {
            type: Sequelize.UUID,
            references: {
              model: 'Profiles',
              key: 'id',
            },
            onDelete: 'SET NULL',
          },
          categoryId: {
            type: Sequelize.UUID,
            references: {
              model: 'Categories',
              key: 'id',
            },
            onDelete: 'SET NULL',
          },
          createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },
          updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },
          deletedAt: {
            allowNull: true,
            type: Sequelize.DATE,
          },
        },
        { transaction },
      );

      await queryInterface.createTable(
        'PostsTags',
        {
          id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
            allowNull: false,
          },
          postId: {
            type: Sequelize.UUID,
            references: {
              model: 'Posts',
              key: 'id',
            },
            onDelete: 'SET NULL',
          },
          tagId: {
            type: Sequelize.UUID,
            references: {
              model: 'Tags',
              key: 'id',
            },
            onDelete: 'SET NULL',
          },
          createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },
          updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },
          deletedAt: {
            allowNull: true,
            type: Sequelize.DATE,
          },
        },
        { transaction },
      );

      await queryInterface.createTable(
        'Comments',
        {
          id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
            allowNull: false,
          },
          content: {
            type: Sequelize.STRING(2000),
            allowNull: false,
          },
          authorId: {
            type: Sequelize.UUID,
            references: {
              model: 'Profiles',
              key: 'id',
            },
            onDelete: 'SET NULL',
          },
          postId: {
            type: Sequelize.UUID,
            references: {
              model: 'Posts',
              key: 'id',
            },
            onDelete: 'SET NULL',
          },
          createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },
          updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },
          deletedAt: {
            allowNull: true,
            type: Sequelize.DATE,
          },
        },
        { transaction },
      );

      await queryInterface.createTable(
        'ProductCategories',
        {
          id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
            allowNull: false,
          },
          name: {
            type: Sequelize.STRING(80),
            allowNull: false,
          },
          profit: {
            type: Sequelize.INTEGER,
            allowNull: false,
            default: 0,
          },
          createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },
          updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },
          deletedAt: {
            allowNull: true,
            type: Sequelize.DATE,
          },
        },
        { transaction },
      );

      await queryInterface.createTable(
        'Products',
        {
          id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
            allowNull: false,
          },
          name: {
            type: Sequelize.STRING(1000),
            allowNull: false,
          },
          images: {
            type: Sequelize.STRING(3000),
            allowNull: true,
          },
          size: {
            type: Sequelize.ENUM,
            values: ProductSize,
          },
          description: {
            type: Sequelize.STRING(3000),
            allowNull: true,
          },
          available: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
          },
          status: {
            type: Sequelize.ENUM,
            values: ProductStatus,
            default: null,
            allowNull: true,
          },
          productCategoryId: {
            type: Sequelize.UUID,
            references: {
              model: 'ProductCategories',
              key: 'id',
            },
            onDelete: 'SET NULL',
          },
          createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },
          updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },
          deletedAt: {
            allowNull: true,
            type: Sequelize.DATE,
          },
        },
        { transaction },
      );

      await queryInterface.createTable(
        'Stocks',
        {
          id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
            allowNull: false,
          },
          productCategoryId: {
            type: Sequelize.UUID,
            references: {
              model: 'ProductCategories',
              key: 'id',
            },
            onDelete: 'SET NULL',
          },
          productId: {
            type: Sequelize.UUID,
            references: {
              model: 'Products',
              key: 'id',
            },
            onDelete: 'SET NULL',
          },
          price: {
            type: Sequelize.DECIMAL(12, 2),
            defaultValue: 0,
            allowNull: false,
          },
          quantity: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false,
          },
          type: {
            type: Sequelize.ENUM,
            values: StockTypes,
            default: null,
            allowNull: true,
          },
          priceHistory: {
            type: Sequelize.JSON,
            defaultValue: null,
            allowNull: true,
          },
          createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },
          updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },
          deletedAt: {
            allowNull: true,
            type: Sequelize.DATE,
          },
        },
        { transaction },
      );

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
      await queryInterface.dropTable('Stocks', { transaction });
      await queryInterface.dropTable('Products', { transaction });
      await queryInterface.dropTable('ProductCategories', { transaction });
      await queryInterface.dropTable('Comments', { transaction });
      await queryInterface.dropTable('PostsTags', { transaction });
      await queryInterface.dropTable('Posts', { transaction });
      await queryInterface.dropTable('Tags', { transaction });
      await queryInterface.dropTable('Categories', { transaction });
      await queryInterface.dropTable('Profiles', { transaction });
      // await queryInterface.dropTable('Users', { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      global.console.error(error);
      throw error;
    }
  },
};
/* eslint-enable @typescript-eslint/explicit-function-return-type */
