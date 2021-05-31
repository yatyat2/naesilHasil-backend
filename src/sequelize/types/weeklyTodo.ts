import { Model, Optional } from 'sequelize';

interface WeeklyTodoAttributes {
  id: string;
  userID: string;
  characterID: string;
  title: string;
  isChecked: boolean;
}

interface WeeklyTodoCreationAttributes
  extends Optional<WeeklyTodoAttributes, 'id'> {}

class WeeklyTodo
  extends Model<WeeklyTodoAttributes, WeeklyTodoCreationAttributes>
  implements WeeklyTodoAttributes {
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

export { WeeklyTodoAttributes, WeeklyTodo };
