import { Model, Optional } from 'sequelize';

interface DailyTodoAttributes {
  id: string;
  userID: string;
  characterID: string;
  title: string;
  isChecked: boolean;
}

interface DailyTodoCreationAttributes
  extends Optional<DailyTodoAttributes, 'id'> {}

class DailyTodo
  extends Model<DailyTodoAttributes, DailyTodoCreationAttributes>
  implements DailyTodoAttributes {
  public id!: string;
  public userID!: string;
  public characterID!: string;
  public title!: string;
  public isChecked!: boolean;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletdAt?: Date;
}

export { DailyTodoAttributes, DailyTodo };
