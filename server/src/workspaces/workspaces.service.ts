import {
	Injectable,
	NotFoundException,
	ConflictException,
	ForbiddenException,
	UnauthorizedException
} from '@nestjs/common';
import * as fs from 'fs';
import { join } from 'path';
import { BaseWorkspaceDto } from './dtos/base.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { BoardsService } from 'src/boards/boards.service';
import { CreateWorkspaceDto } from './dtos/createWorkspace.dto';
import { DeleteWorkspaceDto } from './dtos/deleteWorkspace.dto';
import { RenameWorkspaceDto } from './dtos/renameWorkspace.dto';
import { IWorkspace } from 'src/workspaces/workspace.interfaces';
import { GetWorkspaceDetails } from './dtos/getWorkspaceDetails.dto';
import { EditWorkspaceColleagueDto } from './dtos/editWorkspaceColleague.dto';
import { NotificationsService } from 'src/notifications/notifications.service';

@Injectable()
export class WorkspacesService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly boardsService: BoardsService,
		private readonly notificationsService: NotificationsService
	) {}

	async getWorkspaceBoardIds(workspaceId: number): Promise<number[]> {
		const res = await this.prismaService.board.findMany({
			where: {
				workspaceId
			},
			select: {
				id: true
			}
		});

		return res.map((entry) => entry.id);
	}

	async getWorkspaceUserIds(
		workspaceId: number,
		excludeId: number
	): Promise<number[]> {
		const colleagues = await this.prismaService.user_Workspace.findMany({
			where: {
				workspaceId
			}
		});
		const workspace = await this.prismaService.workspace.findFirst({
			where: {
				id: workspaceId
			}
		});

		return [
			workspace.ownerId,
			...colleagues.map((colleague) => colleague.userId)
		].filter((userId) => userId !== excludeId);
	}

	async getWorkspaceBoardUserIds(
		workspaceId: number,
		excludeId: number
	): Promise<number[]> {
		const usersWithWorkspaceAccess = await this.getWorkspaceUserIds(
			workspaceId,
			excludeId
		);
		const boardIds = await this.getWorkspaceBoardIds(workspaceId);
		const usersWithBoardAccessObjs = await this.prismaService.user.findMany(
			{
				where: {
					User_Board: {
						some: {
							boardId: {
								in: boardIds
							}
						}
					}
				}
			}
		);
		const usersWithBoardAccess = usersWithBoardAccessObjs
			.map((x) => x.id)
			.filter((x) => x !== excludeId);

		return [...usersWithWorkspaceAccess, ...usersWithBoardAccess];
	}

	async getUserWorkspaces(body: BaseWorkspaceDto): Promise<any[]> {
		const workspaces = await this.prismaService.workspace.findMany({
			where: {
				OR: [
					{
						ownerId: body.userData.id
					},
					{
						User_Workspace: {
							some: {
								userId: body.userData.id
							}
						}
					}
				]
			},
			select: {
				id: true,
				name: true,
				User: {
					select: {
						id: true,
						username: true
					}
				},
				_count: {
					select: {
						User_Workspace: true
					}
				}
			},
			distinct: 'id'
		});

		return workspaces.map((workspace) => {
			const res = {
				...workspace,
				ownerName: workspace.User.username,
				usersCount: workspace._count.User_Workspace + 1 //workspace owner also has access to the workspace
			};

			delete res.User;
			delete res._count;

			return res;
		});
	}

	async getWorkspaceById(body: GetWorkspaceDetails) {
		const workspaceBoards = await this.prismaService.board.findMany({
			where: {
				workspaceId: body.workspaceData.id
			}
		});
		const workspaceUsersResult =
			await this.prismaService.user_Workspace.findMany({
				where: {
					workspaceId: body.workspaceData.id
				},
				select: {
					User: {
						select: {
							id: true,
							username: true,
							profileImagePath: true
						}
					}
				}
			});

		const workspaceUsers = workspaceUsersResult.map((user) => {
			const imageBuffer = fs.readFileSync(user.User.profileImagePath);
			const imageBinary = Buffer.from(imageBuffer).toString('base64');

			return {
				...user.User,
				profileImagePath: imageBinary
			};
		});
		const workspaceOwner = await this.prismaService.user.findUnique({
			where: {
				id: body.workspaceData.ownerId
			},
			select: {
				id: true,
				username: true,
				profileImagePath: true
			}
		});

		workspaceOwner.profileImagePath = Buffer.from(
			fs.readFileSync(join(workspaceOwner.profileImagePath))
		).toString('base64');

		const data = {
			...body.workspaceData,
			boards: workspaceBoards,
			workspaceUsers,
			workspaceOwner
		};

		delete data.ownerId;

		return data;
	}

	async create(body: CreateWorkspaceDto): Promise<IWorkspace> {
		// A user can have only one Personal Workspace
		if (body.name.toLowerCase().trim() === 'personal workspace') {
			throw new ConflictException(
				'There can only be one workspace with this name per user!'
			);
		}

		// Handle the case where no colleagues array is passed
		body.colleagues = body.colleagues || [];

		//if the creator somehow decides to add themself or 'Deleted_User' (id: 0)
		if (body.colleagues.includes(body.userData.id)) {
			throw new ForbiddenException(
				'You cannot add yourself as a colleague!'
			);
		}

		if (body.colleagues.includes(0)) {
			throw new ForbiddenException(
				'Invalid colleague ID! Double check and try again!'
			);
		}

		const colleagues = await this.prismaService.user.findMany({
			where: {
				id: {
					in: body.colleagues
				}
			}
		});

		if (colleagues.length < body.colleagues.length) {
			throw new NotFoundException(
				'Invalid colleague ID! Double check and try again!'
			);
		}

		// Create a new workspace with the owner's ID from the token
		const workspace = await this.prismaService.workspace.create({
			data: {
				name: body.name,
				ownerId: body.userData.id
			}
		});

		//create many to many relationships
		const payload = colleagues.map((colleague) => ({
			userId: colleague.id,
			workspaceId: workspace.id
		}));

		await this.prismaService.user_Workspace.createMany({
			data: payload
		});

		const usersToNotify = await this.getWorkspaceUserIds(
			workspace.id,
			body.userData.id
		);

		//generate notifications
		await Promise.all(
			usersToNotify.map(async (colleagueId) => {
				await this.notificationsService.addNotification({
					userId: colleagueId,
					message: `${body.userData.username} 
					has created and added you to workspace "${body.name}".`
				});
			})
		);

		return workspace;
	}

	async rename(body: RenameWorkspaceDto) {
		if (body.workspaceData.name === 'Personal Workspace') {
			throw new ForbiddenException(
				'You cannot rename your Personal Workspace!'
			);
		}

		if (body.newName === 'Personal Workspace') {
			throw new ForbiddenException(
				'There can only be one Personal Workspace per user!'
			);
		}

		await this.prismaService.workspace.update({
			where: {
				id: body.workspaceData.id
			},
			data: {
				...body.workspaceData,
				name: body.newName
			}
		});

		const usersToNotify = await this.getWorkspaceUserIds(
			body.workspaceData.id,
			body.userData.id
		);

		await Promise.all(
			usersToNotify.map(async (userId) => {
				await this.notificationsService.addNotification({
					userId,
					message: `${body.userData.username} has renamed workspace 
					"${body.workspaceData.name}" to "${body.newName}".`
				});
			})
		);
	}

	async delete(body: DeleteWorkspaceDto) {
		//check if user is the workspace owner
		if (!body.userIsWorkspaceOwner) {
			throw new UnauthorizedException('Unauthorized access!');
		}

		//check if the workspace exists and is not 'Personal Workspace'
		if (
			body.workspaceData.name.toLowerCase().trim() ===
			'personal workspace'
		) {
			throw new ForbiddenException(
				'You cannot delete your personal workspace!'
			);
		}

		const usersToNotify = await this.getWorkspaceBoardUserIds(
			body.workspaceData.id,
			body.userData.id
		);
		//delete cascadingly
		await this.boardsService.deleteMany(body.workspaceData.id);

		//remove all users with access to the workspace
		await this.prismaService.user_Workspace.deleteMany({
			where: {
				workspaceId: body.workspaceData.id
			}
		});

		//delete the workspace itself
		await this.prismaService.workspace.delete({
			where: {
				id: body.workspaceData.id
			}
		});

		await Promise.all(
			usersToNotify.map(async (userId) => {
				await this.notificationsService.addNotification({
					userId,
					message: `${body.userData.username} has
					 deleted workspace "${body.workspaceData.name}".`
				});
			})
		);

		return usersToNotify;
	}

	async deleteMany(userId: number) {
		//get all workspaces owned by the user
		const workspaces = await this.prismaService.workspace.findMany({
			where: {
				ownerId: userId
			}
		});

		const affectedUserIds = await Promise.all(
			workspaces.flatMap(async (workspace) => {
				return await this.getWorkspaceBoardUserIds(
					workspace.id,
					workspace.ownerId
				);
			})
		);
		const flattenedUserIds = affectedUserIds.flat();

		//delete all boards inside of all user's workspaces
		await Promise.all(
			workspaces.map(async (workspace) => {
				await this.boardsService.deleteMany(workspace.id);
			})
		);

		//delete user_Workspace entries
		await this.prismaService.user_Workspace.deleteMany({
			where: {
				workspaceId: {
					in: workspaces.map((workspace) => workspace.id)
				}
			}
		});

		//delete the workspaces themselves
		await this.prismaService.workspace.deleteMany({
			where: {
				ownerId: userId
			}
		});

		return Array.from(new Set(flattenedUserIds)).filter(
			(userId) => userId !== undefined
		);
	}

	async addColleague(body: EditWorkspaceColleagueDto) {
		if (
			body.workspaceData.name.toLowerCase().trim() ===
			'personal workspace'
		) {
			throw new ForbiddenException(
				'You cannot add / remove colleagues inside this workspace!'
			);
		}

		// check if the added colleague is already added to the workspace or is the creator himself
		const colleagueIsAlreadyAdded =
			await this.prismaService.user_Workspace.findFirst({
				where: {
					userId: body.colleagueId,
					workspaceId: body.workspaceData.id
				}
			});
		const colleagueIsWorkspaceOwner =
			body.colleagueId === body.workspaceData.ownerId;

		//Trying to add "Deleted User"
		if (body.colleagueId == 0) {
			throw new NotFoundException('Invalid colleague ID!');
		}
		if (colleagueIsAlreadyAdded) {
			throw new ConflictException('User is already added to workspace!');
		}
		if (colleagueIsWorkspaceOwner) {
			throw new ConflictException(
				'You cannot add the creator of the workspace to the workspace itself!'
			);
		}

		//add colleague to workspace but remove from any board inside the workspace
		await this.prismaService.user_Workspace.create({
			data: {
				userId: body.colleagueId,
				workspaceId: body.workspaceData.id
			}
		});
		const boardIds = await this.getWorkspaceBoardIds(body.workspaceData.id);

		await this.prismaService.user_Board.deleteMany({
			where: {
				AND: [
					{ userId: body.colleagueId },
					{
						boardId: {
							in: boardIds
						}
					}
				]
			}
		});

		const workspaceUserIds = await this.getWorkspaceUserIds(
			body.workspaceData.id,
			body.userData.id
		);

		const colleague = await this.prismaService.user.findFirst({
			where: {
				id: body.colleagueId
			}
		});

		await Promise.all(
			workspaceUserIds.map(async (userId) => {
				await this.notificationsService.addNotification({
					userId,
					message: `${body.userData.username} has added ${colleague.username}
					 to workspace "${body.workspaceData.name}".`
				});
			})
		);

		return colleague.username;
	}

	async removeColleague(body: EditWorkspaceColleagueDto) {
		if (
			body.workspaceData.name.toLowerCase().trim() ===
			'personal workspace'
		) {
			throw new ForbiddenException(
				'You cannot add / remove colleagues inside this workspace!'
			);
		}

		// check if the colleague to remove is the workspace owner themself
		const colleagueIsWorkspaceOwner =
			body.colleagueId === body.workspaceData.ownerId;
		if (colleagueIsWorkspaceOwner) {
			throw new ForbiddenException(
				'You cannot remove the workspace owner from their workspace!'
			);
		}

		const colleagueIsUser = body.colleagueId === body.userData.id;
		if (colleagueIsUser) {
			throw new ForbiddenException(
				'You cannot remove yourself from the workspace!'
			);
		}

		const workspaceUserIds = await this.getWorkspaceUserIds(
			body.workspaceData.id,
			body.userData.id
		);

		const colleague = await this.prismaService.user.findFirst({
			where: {
				id: body.colleagueId
			}
		});

		await Promise.all(
			workspaceUserIds.map(async (userId) => {
				await this.notificationsService.addNotification({
					userId,
					message: `${body.userData.username} has removed ${colleague.username}
					 from workspace "${body.workspaceData.name}" and from all its boards.`
				});
			})
		);

		// deleteMany will not throw error in case of no matching colleagueId record
		await this.prismaService.user_Workspace.deleteMany({
			where: {
				AND: [
					{ userId: body.colleagueId },
					{ workspaceId: body.workspaceData.id }
				]
			}
		});

		return colleague.username;
	}
}
