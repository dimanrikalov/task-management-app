import {
    Model,
    Table,
    Column,
    DataType,
    ForeignKey,
    PrimaryKey,
} from 'sequelize-typescript';
import { User } from './user.model';
import { Workspace } from './workspace.model';

@Table({ tableName: 'User_Workspace' })
export class User_Workspace extends Model<User_Workspace> {
    @ForeignKey(() => User)
    @PrimaryKey
    @Column({
        type: DataType.INTEGER,
    })
    user_id: number;

    @ForeignKey(() => Workspace)
    @PrimaryKey
    @Column({
        type: DataType.INTEGER,
    })
    workspace_id: number;
}
