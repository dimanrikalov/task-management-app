import { CreateColumnDto } from "src/columns/dtos/createColumn.dto";

export interface ICreateColumn extends CreateColumnDto {
    authorizationToken: string;
}