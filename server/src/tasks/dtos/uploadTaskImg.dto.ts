import { Task } from "@prisma/client";

export class UploadTaskImgDto {
    task: Task;
    token: string;
    taskImagePath: string;
}
