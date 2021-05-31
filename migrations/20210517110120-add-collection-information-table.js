'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.createTable('CollectionInformation', {
        id: {
          allowNull: false,
          type: Sequelize.DataTypes.UUID,
          defaultValue: Sequelize.DataTypes.UUIDV4,
          primaryKey: true,
          unique: true,
        },
        userID: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        title: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        category: {
          type: Sequelize.DataTypes.STRING,
          allowNull: false,
        },
        isSuccess: {
          allowNull: false,
          type: Sequelize.BOOLEAN,
          defaultValue: false,
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
      }),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([queryInterface.dropTable('CollectionInformation')]);
  },
};
