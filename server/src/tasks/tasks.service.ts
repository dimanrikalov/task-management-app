import {
	Injectable,
	NotFoundException,
	ConflictException,
	ForbiddenException,
	UnauthorizedException
} from '@nestjs/common';
import * as fs from 'fs';
import { promisify } from 'util';
import { MoveTaskDto } from './dtos/moveTask.dto';
import { ModifyTaskDto } from './dtos/modifyTask.dto';
import { CreateTaskDto } from './dtos/createTask.dto';
import { IBoard } from 'src/boards/boards.interfaces';
import { StepsService } from 'src/steps/steps.service';
import { DeleteTasksDto } from './dtos/deleteTask.dto';
import { extractJWTData } from 'src/jwt/extractJWTData';
import { PrismaService } from 'src/prisma/prisma.service';
import { CompleteTaskDto } from './dtos/completeTask.dto';
import { UploadTaskImgDto } from './dtos/uploadTaskImg.dto';
import { IWorkspace } from 'src/workspaces/workspace.interfaces';
import { NotificationsService } from 'src/notifications/notifications.service';

const unlink = promisify(fs.unlink);

@Injectable()
export class TasksService {
	constructor(
		private readonly stepsService: StepsService,
		private readonly prismaService: PrismaService,
		private readonly notificationsService: NotificationsService
	) {}

	async getBoardUsers(
		boardData: IBoard,
		workspaceData: IWorkspace,
		excludeId: number
	) {
		const boardUsers = await this.prismaService.user_Board.findMany({
			where: {
				boardId: boardData.id
			}
		});

		const workspaceUsers = await this.prismaService.user_Workspace.findMany(
			{
				where: {
					workspaceId: workspaceData.id
				}
			}
		);

		const boardUserIds = boardUsers.map((user) => user.userId);
		const workspaceUserIds = workspaceUsers.map((user) => user.userId);

		return [
			...boardUserIds,
			...workspaceUserIds,
			workspaceData.ownerId
		].filter((userId) => userId !== excludeId);
	}

	async validateUserAccessToBoard({ task, token }) {
		const userData = extractJWTData(token);

		const column = await this.prismaService.column.findFirst({
			where: {
				id: task.columnId
			}
		});

		const board = await this.prismaService.board.findFirst({
			where: {
				id: column.boardId
			}
		});

		const workspace = await this.prismaService.workspace.findFirst({
			where: {
				id: board.workspaceId
			}
		});

		//user has access to board
		const userHasBoardAccess =
			await this.prismaService.user_Board.findFirst({
				where: {
					AND: [
						{
							userId: userData.id
						},
						{
							boardId: board.id
						}
					]
				}
			});

		//user has access to board's workspace
		const userHasWorkspaceAccess =
			await this.prismaService.user_Workspace.findFirst({
				where: {
					AND: [
						{ userId: userData.id },
						{ workspaceId: board.workspaceId }
					]
				}
			});

		//user is workspace owner
		const userIsWorkspaceOwner = workspace.ownerId === userData.id;

		if (
			!userHasBoardAccess &&
			!userHasWorkspaceAccess &&
			!userIsWorkspaceOwner
		) {
			throw new UnauthorizedException(
				'You do not have access to this board!'
			);
		}
	}

	async getById(id: number) {
		return await this.prismaService.task.findUnique({
			where: {
				id
			}
		});
	}

	stepsHaveRepeatingDescriptions(arr: any[], propertyName: string) {
		const valueSet = new Set();

		for (const obj of arr) {
			const propertyValue = obj[propertyName]?.toLowerCase()?.trim();

			if (propertyValue && valueSet.has(propertyValue)) {
				return true; // Found repeating descriptions, no need to continue checking
			}

			valueSet.add(propertyValue);
		}

		return false; // No repeating descriptions found
	}

	async create(body: CreateTaskDto) {
		// Check if task name is unique in the scope of the board
		const isTaskTitleTaken = !!(await this.prismaService.task.findFirst({
			where: {
				AND: [
					{
						title: {
							equals: body.title.toLowerCase().trim(),
							mode: 'insensitive'
						}
					},
					{
						Column: {
							boardId: body.boardData.id
						}
					}
				]
			},
			distinct: ['id']
		}));
		if (isTaskTitleTaken) {
			throw new ConflictException('Task title is taken!');
		}

		if (body.assigneeId === 0) {
			throw new ForbiddenException('Invalid assignee ID!');
		}

		//handle the case of no array being passed as payload
		body.steps = body.steps || [];

		//check for duplicate task description
		const isTaskDuplicate = this.stepsHaveRepeatingDescriptions(
			body.steps,
			'description'
		);

		if (isTaskDuplicate) {
			throw new ConflictException('Task descriptions must be unqiue!');
		}

		//calculate the progress based on how many tasks are completed
		const completeSteps = body.steps.filter((step) => {
			if (step.isComplete) {
				return step;
			}
		});
		const progress = Math.round(
			(completeSteps.length / body.steps.length) * 100
		);

		//check if assigneeId has access to board
		const assigneeHasAccessToBoard =
			!!(await this.prismaService.user.findFirst({
				where: {
					OR: [
						{
							User_Workspace: {
								some: {
									AND: [
										{ userId: body.assigneeId },
										{ workspaceId: body.workspaceData.id }
									]
								}
							}
						},
						{
							User_Board: {
								some: {
									AND: [
										{ userId: body.assigneeId },
										{ boardId: body.boardData.id }
									]
								}
							}
						}
					]
				}
			}));

		const assigneeIsWorkspaceOwner =
			body.assigneeId === body.workspaceData.ownerId;

		if (!assigneeIsWorkspaceOwner && !assigneeHasAccessToBoard) {
			throw new UnauthorizedException(
				'Assignee does not have access to board!'
			);
		}

		const tasksCount = await this.prismaService.task.count({
			where: {
				columnId: body.columnData.id
			}
		});

		// Create task
		const task = await this.prismaService.task.create({
			data: {
				title: body.title,
				effort: body.effort,
				position: tasksCount,
				progress: progress || 0,
				priority: body.priority,
				assigneeId: body.assigneeId,
				hoursSpent: body.hoursSpent,
				columnId: body.columnData.id,
				description: body.description,
				minutesSpent: body.minutesSpent,
				estimatedHours: body.estimatedHours,
				estimatedMinutes: body.estimatedMinutes,
				attachmentImgPath: body.attachmentImgPath
			}
		});

		// Create steps
		await this.stepsService.createMany(body.steps, task.id);

		//if user is not assigning themselves create a notification
		if (body.userData.id !== body.assigneeId) {
			await this.notificationsService.addNotification({
				userId: body.assigneeId,
				message: `${body.userData.username} has assigned you to task
				 - "${body.title}" inside board "${body.boardData.name}".`
			});
		}

		// Emit event with boardId to cause everyone on the board to refetch

		return { ...task, steps: body.steps };
	}

	async uploadTaskImg(body: UploadTaskImgDto) {
		// Check if the file exists before attempting to delete it
		if (fs.existsSync(body.task.attachmentImgPath)) {
			// Delete the existing file
			await unlink(body.task.attachmentImgPath);
		}

		// Update the user's profile image path
		await this.prismaService.task.update({
			where: {
				id: body.task.id
			},
			data: {
				attachmentImgPath: body.taskImagePath
			}
		});
	}

	async delete(body: DeleteTasksDto) {
		const { boardData, columnData, taskData } = body;
		const tasksCount = await this.prismaService.task.count({
			where: {
				columnId: columnData.id
			}
		});

		//move the task to last place
		await this.move({
			taskData,
			boardData,
			destinationColumnId: columnData.id,
			destinationPosition: tasksCount - 1
		});

		//delete the steps
		await this.prismaService.step.deleteMany({
			where: {
				taskId: body.taskData.id
			}
		});

		//delete task image if it exists
		if (fs.existsSync(body.taskData.attachmentImgPath)) {
			// Delete the existing file
			await unlink(body.taskData.attachmentImgPath);
		}

		//delete the task
		await this.prismaService.task.delete({
			where: {
				id: body.taskData.id
			}
		});

		//if the user that deletes the task is different than the assignee, notify the assignee
		if (body.userData.id !== body.taskData.assigneeId) {
			await this.notificationsService.addNotification({
				userId: body.taskData.assigneeId,
				message: `${body.userData.username} has deleted task "${body.taskData.title}"
				 which was assigned to you inside board "${body.boardData.name}".`
			});
		}
	}

	async deleteMany(columnId: number) {
		//get all tasks from the column
		const tasks = await this.prismaService.task.findMany({
			where: {
				columnId
			}
		});
		//delete all steps of every task from the column

		await this.prismaService.step.deleteMany({
			where: {
				taskId: {
					in: tasks.map((task) => task.id)
				}
			}
		});

		//delete task images
		await Promise.all(
			tasks.map(async (task) => {
				//delete task image if it exists
				if (fs.existsSync(task.attachmentImgPath)) {
					// Delete the existing file
					await unlink(task.attachmentImgPath);
				}
			})
		);

		//delete the tasks themselves
		await this.prismaService.task.deleteMany({
			where: {
				columnId
			}
		});
	}

	async edit(body: ModifyTaskDto) {
		//check for any task other than the one being updated for having the same title
		const isTaskTitleTaken = !!(await this.prismaService.task.findFirst({
			where: {
				AND: [
					{
						title: {
							equals: body.payload.title.trim(),
							mode: 'insensitive'
						}
					},
					{
						Column: {
							boardId: body.boardData.id
						}
					},
					{
						NOT: {
							id: body.taskData.id
						}
					}
				]
			},
			distinct: ['id']
		}));

		if (isTaskTitleTaken) {
			throw new ConflictException('Task title is taken!');
		}

		const stepsToEdit = [];
		const stepsToCreate = [];

		body.payload.steps.forEach((task) => {
			if (task.id) {
				stepsToEdit.push(task);
				return;
			}

			stepsToCreate.push(task);
		});

		const stepIdsToKeep = stepsToEdit.map((step) => step.id);
		await this.stepsService.deleteManyNotIn(
			body.taskData.id,
			stepIdsToKeep
		);

		await this.stepsService.updateMany(stepsToEdit);
		await this.stepsService.createMany(stepsToCreate, body.taskData.id);

		delete body.payload.steps;

		//update progress
		const totalSteps = await this.prismaService.step.count({
			where: {
				taskId: body.taskData.id
			}
		});

		const completeSteps = await this.prismaService.step.count({
			where: {
				AND: [{ taskId: body.taskData.id }, { isComplete: true }]
			}
		});

		const progress = Math.round((completeSteps / totalSteps) * 100) || 0;

		//remove image if the task has one and add it with next request
		if (body.taskData.attachmentImgPath) {
			await unlink(body.taskData.attachmentImgPath);
		}

		//update the task
		const task = await this.prismaService.task.update({
			where: {
				id: body.taskData.id
			},
			data: {
				...body.payload,
				progress,
				attachmentImgPath: null
			}
		});

		const steps = await this.prismaService.step.findMany({
			where: { taskId: task.id }
		});

		const oldAssignee = await this.prismaService.user.findFirst({
			where: {
				id: body.taskData.assigneeId
			}
		});

		const newAssignee = await this.prismaService.user.findFirst({
			where: {
				id: body.payload.assigneeId
			}
		});

		if (
			body.userData.id !== body.payload.assigneeId &&
			body.payload.assigneeId !== body.taskData.assigneeId
		) {
			//notify the user that is no longer assigned to the task
			await this.notificationsService.addNotification({
				userId: body.taskData.assigneeId,
				message: `Task "${body.taskData.title}" which was previously
				 assigned to you is now assigned to ${newAssignee.username}.`
			});

			//notify the user that is newly assigned to the task
			await this.notificationsService.addNotification({
				userId: newAssignee.id,
				message: `Task "${body.taskData.title}" which was previously
				assigned to ${oldAssignee.username} is now assigned to you.`
			});
		}

		//if the user that edits the task is different than the assignee, notify the assignee
		// using body.taskData.assigneeId ensures we send the notification to the previous assignee
		const isThereNewAssignee =
			body.payload.assigneeId !== body.taskData.assigneeId;

		if (
			isThereNewAssignee &&
			body.userData.id !== body.payload.assigneeId
		) {
			await this.notificationsService.addNotification({
				userId: body.payload.assigneeId,
				message: `${body.userData.username} has modified task "${body.taskData.title}"
				 which was assigned to you inside board "${body.boardData.name}".`
			});
		} else if (
			!isThereNewAssignee &&
			body.userData.id !== body.taskData.assigneeId
		) {
			await this.notificationsService.addNotification({
				userId: body.taskData.assigneeId,
				message: `${body.userData.username} has modified task "${body.taskData.title}"
				 which was assigned to you inside board "${body.boardData.name}".`
			});
		}

		return { ...task, steps };
	}

	async complete(body: CompleteTaskDto) {
		await this.prismaService.step.updateMany({
			where: {
				taskId: body.taskData.id
			},
			data: {
				isComplete: true
			}
		});

		await this.prismaService.task.update({
			where: {
				id: body.taskData.id
			},
			data: {
				progress: 100
			}
		});

		const boardUsersId = await this.getBoardUsers(
			body.boardData,
			body.workspaceData,
			body.userData.id
		);

		//notify the assignee if someone else moves their task as complete
		if (body.userData.id !== body.taskData.assigneeId) {
			await Promise.all(
				boardUsersId.map(async (userId) => {
					await this.notificationsService.addNotification({
						userId,
						message: `${body.userData.id} has marked task "${body.taskData.title}"
							inside board "${body.boardData.name}" as complete.`
					});
				})
			);
		}
	}

	async move(body: MoveTaskDto) {
		//moving tasks between columns
		if (body.taskData.columnId !== body.destinationColumnId) {
			//make sure the columns are also part of the board!
			const sourceColumn = await this.prismaService.column.findFirst({
				where: {
					AND: [
						{ id: body.taskData.columnId },
						{ boardId: body.boardData.id }
					]
				}
			});

			const destinationColumn = await this.prismaService.column.findFirst(
				{
					where: {
						AND: [
							{ id: body.destinationColumnId },
							{ boardId: body.boardData.id }
						]
					}
				}
			);

			if (!sourceColumn || !destinationColumn) {
				throw new NotFoundException('Invalid column IDs!');
			}

			const tasksInsideSourceColumn =
				await this.prismaService.task.findMany({
					where: {
						columnId: sourceColumn.id
					}
				});

			const tasksInsideDestinationColumn =
				await this.prismaService.task.findMany({
					where: {
						columnId: destinationColumn.id
					}
				});

			//DESTINATION CHECKS
			//1st case move task between some other tasks
			//2nd case move after the last task from the column

			Promise.all(
				tasksInsideSourceColumn.map(async (task) => {
					if (task.position > body.taskData.position) {
						await this.prismaService.task.update({
							where: {
								id: task.id
							},
							data: {
								position: task.position - 1
							}
						});
					}
				})
			);

			Promise.all(
				tasksInsideDestinationColumn.map(async (task) => {
					if (task.position >= body.destinationPosition) {
						await this.prismaService.task.update({
							where: {
								id: task.id
							},
							data: {
								position: task.position + 1
							}
						});
					}
				})
			);

			//update the task
			await this.prismaService.task.update({
				where: {
					id: body.taskData.id
				},
				data: {
					columnId: body.destinationColumnId,
					position: body.destinationPosition
				}
			});
			return;
		}

		const tasksInsideDestinationColumn =
			await this.prismaService.task.findMany({
				where: {
					columnId: body.destinationColumnId
				},
				orderBy: {
					position: 'asc'
				}
			});

		if (body.destinationPosition == body.taskData.position) {
			return;
		}

		// Ensure the destination position is within the valid range
		if (body.destinationPosition >= tasksInsideDestinationColumn.length) {
			body.destinationPosition = tasksInsideDestinationColumn.length - 1;
		}

		if (body.destinationPosition > body.taskData.position) {
			const matches = await this.prismaService.task.findMany({
				where: {
					AND: [
						{
							position: {
								gt: body.taskData.position
							}
						},
						{
							position: {
								lte: body.destinationPosition
							}
						},
						{ columnId: body.destinationColumnId }
					]
				}
			});

			await Promise.all(
				matches.map(async (task) => {
					await this.prismaService.task.update({
						where: {
							id: task.id
						},
						data: {
							position: task.position - 1
						}
					});
				})
			);

			await this.prismaService.task.update({
				where: {
					id: body.taskData.id
				},
				data: {
					position: body.destinationPosition
				}
			});

			return;
		}

		const matches = await this.prismaService.task.findMany({
			where: {
				AND: [
					{
						position: {
							gte: body.destinationPosition
						}
					},
					{
						position: {
							lt: body.taskData.position
						}
					},
					{ columnId: body.destinationColumnId }
				]
			}
		});

		await Promise.all(
			matches.map(async (task) => {
				await this.prismaService.task.update({
					where: {
						id: task.id
					},
					data: {
						position: task.position + 1
					}
				});
			})
		);

		await this.prismaService.task.update({
			where: {
				id: body.taskData.id
			},
			data: {
				position: body.destinationPosition
			}
		});
	}
}
