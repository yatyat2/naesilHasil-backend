import { Model, Optional } from 'sequelize';

interface UserAttributes {
  id: string;
  email: string;
  password: string;
  characterIDs: string;
}

interface UserCreationAttributes
  extends Optional<UserAttributes, 'id' | 'characterIDs'> {}

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes {
  public id!: string; // Note that the `null assertion` `!` is required in strict mode.
  public email!: string;
  public password!: string;
  public characterIDs!: string;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletdAt?: Date;
}

export { UserAttributes, User };
