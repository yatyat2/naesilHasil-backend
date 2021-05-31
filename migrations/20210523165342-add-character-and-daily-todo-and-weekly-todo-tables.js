'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.createTable('Character', {
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
        name: {
          allowNull: false,
          type: Sequelize.STRING,
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

      queryInterface.createTable('DailyTodo', {
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
        characterID: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        title: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        isChecked: {
          allowNull: false,
          type: Sequelize.BOOLEAN,
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
      queryInterface.createTable('WeeklyTodo', {
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
        characterID: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        title: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        isChecked: {
          allowNull: false,
          type: Sequelize.BOOLEAN,
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
    return Promise.all([
      queryInterface.dropTable('Character'),
      queryInterface.dropTable('DailyTodo'),
      queryInterface.dropTable('WeeklyTodo'),
    ]);
  },
};
