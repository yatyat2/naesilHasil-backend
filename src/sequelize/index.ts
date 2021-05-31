import { Sequelize, DataTypes, UUIDV4 } from 'sequelize';
import { User } from './types/user';
import { CollectionInformation } from './types/collectionInformation';
import { Character } from './types/character';
import { DailyTodo } from './types/dailyTodo';
import { WeeklyTodo } from './types/weeklyTodo';

import { DB_USER, DB_PASSWORD, DB_PORT, DB_NAME, DB_HOST } from '../constant';

const initSequelize = () => {
  const sequelize = new Sequelize(
    `mysql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,
  );

  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      email: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      password: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      characterIDs: {
        type: DataTypes.STRING,
        allowNull: true,
        get() {
          if (this.getDataValue('characterIDs')) {
            return this.getDataValue('characterIDs').split(';');
          } else {
            return null;
          }
        },
        set(val: string[]) {
          this.setDataValue('characterIDs', val.join(';'));
        },
      },
    },
    {
      tableName: 'User',
      sequelize, // passing the `sequelize` instance is required
    },
  );

  CollectionInformation.init(
    {
      id: {
        allowNull: false,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        unique: true,
      },
      userID: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      title: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isSuccess: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: 'CollectionInformation',
      sequelize,
    },
  );

  Character.init(
    {
      id: {
        allowNull: false,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        unique: true,
      },
      userID: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
    },
    {
      tableName: 'Character',
      sequelize,
    },
  );

  DailyTodo.init(
    {
      id: {
        allowNull: false,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        unique: true,
      },
      userID: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      characterID: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      title: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      isChecked: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
      },
    },
    {
      tableName: 'DailyTodo',
      sequelize,
    },
  );

  WeeklyTodo.init(
    {
      id: {
        allowNull: false,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        unique: true,
      },
      userID: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      characterID: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      title: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      isChecked: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
      },
    },
    {
      tableName: 'WeeklyTodo',
      sequelize,
    },
  );

  Character.hasMany(DailyTodo, {
    foreignKey: 'characterID',
    as: 'dailyTodos',
  });
  Character.hasMany(WeeklyTodo, {
    foreignKey: 'characterID',
    as: 'weeklyTodos',
  });
};

export { initSequelize };
