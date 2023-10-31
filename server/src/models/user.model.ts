import {BelongsToMany} from 'sequelize-typescript';
import { Workspace } from 'src/models/workspace.model';
import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({tableName: 'User'})
export class User extends Model<User> {
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
    first_name: string;

    @Column({
        type: DataType.STRING(128),
        allowNull: false,
    })
    last_name: string;

    @Column({
        type: DataType.STRING(128),
        allowNull: false,
    })
    email: string;

    @Column({
        type: DataType.STRING(64),
        allowNull: false,
    })
    password: string;

    @Column({
        type: DataType.TEXT,
        allowNull: false,
    })
    profile_image_path: string;

    @BelongsToMany(() => Workspace, {
        through: 'User_Workspace',
        foreignKey: 'user_id',
        otherKey: 'workspace_id',
        // as: 'workspace', // Add this line to specify the alias
    })
    workspaces: Workspace[];
}