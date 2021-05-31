import { Model, Optional } from 'sequelize';

interface CharacterAttributes {
  id: string;
  userID: string;
  name: string;
}

interface CharacterCreationAttributes
  extends Optional<CharacterAttributes, 'id'> {}

class Character
  extends Model<CharacterAttributes, CharacterCreationAttributes>
  implements CharacterAttributes {
  public id!: string; // Note that the `null assertion` `!` is required in strict mode.
  public userID!: string;
  public name!: string;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletdAt?: Date;
}

export { CharacterAttributes, Character };
