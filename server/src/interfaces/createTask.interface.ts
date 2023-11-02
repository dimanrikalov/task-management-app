import { CreateTaskDto } from "src/tasks/dtos/createTask.dto";

export interface ICreateTask extends CreateTaskDto {
    authorizationToken: string
}