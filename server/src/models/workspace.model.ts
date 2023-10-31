import {
    Model,
    Table,
    Column,
    DataType,
    BelongsTo,
    ForeignKey,
    BelongsToMany,
} from 'sequelize-typescript';
import { User } from './user.model';

@Table({ tableName: 'Workspace' })
export class Workspace extends Model<Workspace> {
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @Column({
        type: DataType.STRING(128),
        allowNull: false,
    })
    name: string;

    @ForeignKey(() => User) // Define a foreign key to User
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    owner_id: number;

    @BelongsTo(() => User) // Create a BelongsTo association with the User model
    owner: User; // Define an owner property to access the associated User model

    // Define a one-to-many association from Workspace to Board
    // This allows multiple boards to belong to one workspace
    @BelongsToMany(() => User, {
        through: 'User_Workspace',
        foreignKey: 'workspace_id',
        otherKey: 'user_id',
        as: 'users', // Add this line to specify the alias
    })
    users: User[];
}
