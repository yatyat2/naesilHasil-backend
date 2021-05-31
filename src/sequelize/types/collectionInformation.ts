import { Model, Optional } from 'sequelize';

interface CollectionInformationAttributes {
  id: string;
  userID: string;
  title: string;
  category: string;
  isSuccess: boolean;
}

interface CollectionInformationCreationAttributes
  extends Optional<CollectionInformationAttributes, 'id'> {}

class CollectionInformation
  extends Model<
    CollectionInformationAttributes,
    CollectionInformationCreationAttributes
  >
  implements CollectionInformationAttributes {
  public id!: string;
  public userID!: string;
  public title!: string;
  public category!: string;
  public isSuccess!: boolean;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletdAt?: Date;
}

export { CollectionInformationAttributes, CollectionInformation };
