import {
    Model,
    Table,
    Column,
    DataType,
    BelongsTo,
    ForeignKey,
} from 'sequelize-typescript';
import { User } from './user.model';
import { Workspace } from './workspace.model';

@Table({ tableName: 'Board' })
export class Board extends Model<Board> {
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

    @ForeignKey(() => Workspace) // Define a foreign key to Workspace
    @Column({
        type: DataType.INTEGER,
        allowNull: true, // Allow null to indicate boards without a workspace
    })
    workspace_id: number;

    @BelongsTo(() => Workspace) // Create a BelongsTo association with the Workspace model
    workspace: Workspace; // Define a workspace property to access the associated Workspace model
}
