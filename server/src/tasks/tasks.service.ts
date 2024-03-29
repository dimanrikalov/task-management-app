import {
	Injectable,
	NotFoundException,
	ConflictException,
	ForbiddenException,
	UnauthorizedException
} from '@nestjs/common';
import * as fs from 'fs';
import { join } from 'path';
import { promisify } from 'util';
import { v4 as uuid } from 'uuid';
import { MoveTaskDto } from './dtos/moveTask.dto';
import { ModifyTaskDto } from './dtos/modifyTask.dto';
import { CreateTaskDto } from './dtos/createTask.dto';
import { IBoard } from 'src/boards/boards.interfaces';
import { StepsService } from 'src/steps/steps.service';
import { DeleteTasksDto } from './dtos/deleteTask.dto';
import { extractJWTData } from 'src/jwt/extractJWTData';
import { PrismaService } from 'src/prisma/prisma.service';
import { CompleteTaskDto } from './dtos/completeTask.dto';
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

		return Array.from(
			new Set([
				...boardUserIds,
				...workspaceUserIds,
				workspaceData.ownerId
			])
		).filter((userId) => userId !== excludeId && userId !== undefined);
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

		return { user: userData, board };
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

		let startedAt = null;
		let completedAt = null;

		switch (body.columnData.name) {
			case 'To Do':
				startedAt = null;
				completedAt = null;
				break;
			case 'Done':
				startedAt = new Date(Date.now());
				completedAt = new Date(Date.now());
				break;
			default:
				completedAt = null;
				startedAt = new Date(Date.now());
				break;
		}

		//prepare the data
		const data: any = {
			startedAt,
			completedAt,
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
			estimatedMinutes: body.estimatedMinutes
		};

		//image upload logic
		if (body.attachmentImg) {
			const uploadDir = process.env.TASK_IMGS_URL;

			if (!fs.existsSync(uploadDir)) {
				fs.mkdirSync(uploadDir, { recursive: true });
			}

			const fileName = `task-img-${uuid()}`;
			const filePath = join(uploadDir, fileName);

			//write to file
			fs.writeFileSync(filePath, body.attachmentImg, 'base64');

			data.attachmentImgPath = filePath;
		}

		// Create task
		const task = await this.prismaService.task.create({ data });

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

		return { ...task, steps: body.steps };
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
		if (
			body.userData.id !== body.taskData.assigneeId &&
			body.taskData.assigneeId !== 0
		) {
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

		return Array.from(new Set(tasks.map((task) => task.assigneeId))).filter(
			(task) => task !== undefined
		);
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

		const startedAt = body.taskData.startedAt || new Date(Date.now());
		const completedAt = progress === 100 ? new Date(Date.now()) : null;

		const data: any = {
			...body.payload,
			progress,
			startedAt,
			completedAt,
			attachmentImgPath: null
		};

		delete data.attachmentImg;

		//handle image upload
		if (fs.existsSync(body.taskData.attachmentImgPath)) {
			await unlink(body.taskData.attachmentImgPath);
		}

		if (body.payload.attachmentImg) {
			const uploadDir = process.env.TASK_IMGS_URL;

			if (!fs.existsSync(uploadDir)) {
				fs.mkdirSync(uploadDir, { recursive: true });
			}

			const fileName = `task-img-${uuid()}`;
			const filePath = join(uploadDir, fileName);

			fs.writeFileSync(filePath, body.payload.attachmentImg, 'base64');
			data.attachmentImgPath = filePath;
		}

		//update the task
		const task = await this.prismaService.task.update({
			where: {
				id: body.taskData.id
			},
			data
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

		//if the task has a new assignee
		const isThereNewAssignee = oldAssignee.id !== newAssignee.id;
		const isUserNewAssignee = body.userData.id === newAssignee.id;
		const isTaskAssigneeModifyingTask = body.userData.id === oldAssignee.id;

		const userIdsToNotify: { userId: number; message: string }[] = [];

		const boardUsers = await this.getBoardUsers(
			body.boardData,
			body.workspaceData,
			body.userData.id
		);

		const isOldAssigneePartOfBoard = boardUsers.some(
			(userId) => userId === oldAssignee.id
		);

		if (isThereNewAssignee) {
			if (isOldAssigneePartOfBoard) {
				//notify the user that is no longer assigned to the task
				const message = `Task "${body.taskData.title}" which was previously
				assigned to you is now assigned to ${newAssignee.username}.`;
				await this.notificationsService.addNotification({
					message,
					userId: body.taskData.assigneeId
				});
				userIdsToNotify.push({ userId: oldAssignee.id, message });
			}

			if (!isUserNewAssignee) {
				const message = `Task "${body.taskData.title}" which was previously
				assigned to ${oldAssignee.username} is now assigned to you.`;
				//notify the user that is newly assigned to the task
				await this.notificationsService.addNotification({
					message,
					userId: newAssignee.id
				});
				userIdsToNotify.push({ userId: newAssignee.id, message });
			}
		} else {
			if (!isTaskAssigneeModifyingTask && isOldAssigneePartOfBoard) {
				const message = `Task "${body.taskData.title}" assigned
				to you was modified by ${body.userData.username}.`;
				await this.notificationsService.addNotification({
					message,
					userId: body.taskData.assigneeId
				});
				userIdsToNotify.push({ userId: oldAssignee.id, message });
			}
		}

		return {
			userIdsToNotify,
			task: { ...task, steps }
		};
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

		//notify the assignee if someone else moves their task as complete
		if (body.userData.id !== body.taskData.assigneeId) {
			this.notificationsService.addNotification({
				userId: body.taskData.assigneeId,
				message: `${body.userData.username} has marked task
				 "${body.taskData.title}" that was assigned to you as complete.`
			});
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

			let progress = 100;
			let startedAt = body.taskData.startedAt;
			let completedAt = body.taskData.completedAt;

			switch (destinationColumn.name) {
				case 'To Do':
					progress = 0;
					startedAt = null;
					completedAt = null;
					break;
				case 'Done':
					progress = 100;
					completedAt = new Date(Date.now());
					startedAt = startedAt || new Date(Date.now());
					break;
				default:
					progress =
						(body.taskData.Step.reduce(
							(acc, task) => (task.isComplete ? acc + 1 : acc),
							0
						) /
							body.taskData.Step.length) *
							100 || 0;
					completedAt = null;
					startedAt = startedAt || new Date(Date.now());
					break;
			}

			//update the task
			await this.prismaService.task.update({
				where: {
					id: body.taskData.id
				},
				data: {
					progress,
					startedAt,
					completedAt,
					columnId: body.destinationColumnId,
					position: body.destinationPosition
				}
			});

			if (destinationColumn.name === 'To Do') {
				await this.prismaService.step.updateMany({
					where: {
						taskId: body.taskData.id
					},
					data: {
						isComplete: false
					}
				});
			}

			await this.optimizeTaskPositions(body.boardData.id);
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

		await this.optimizeTaskPositions(body.boardData.id);
	}

	async optimizeTaskPositions(boardId: number) {
		const columns = await this.prismaService.column.findMany({
			include: {
				Task: {
					orderBy: {
						position: 'asc'
					}
				}
			},
			where: {
				boardId
			}
		});

		for (const column of columns) {
			const tasks = column.Task.sort((a, b) => a.position - b.position);

			for (let i = 0; i < tasks.length; i++) {
				await this.prismaService.task.update({
					where: {
						id: tasks[i].id
					},
					data: { position: i }
				});
			}
		}
	}

	async sendNotification(userId: number, message: string) {
		await this.notificationsService.addNotification({ userId, message });
	}
}
