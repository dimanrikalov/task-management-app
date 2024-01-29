import {
	EVENTS,
	SocketGateway,
	generateBoardRoomName,
	generateWorkspaceRoomName
} from 'src/socket/socket.gateway';
import { Response } from 'express';
import { BaseWorkspaceDto } from './dtos/base.dto';
import { WorkspacesService } from './workspaces.service';
import { DeleteWorkspaceDto } from './dtos/deleteWorkspace.dto';
import { RenameWorkspaceDto } from './dtos/renameWorkspace.dto';
import { CreateWorkspaceDto } from './dtos/createWorkspace.dto';
import { GetWorkspaceDetails } from './dtos/getWorkspaceDetails.dto';
import { EditWorkspaceColleagueDto } from './dtos/editWorkspaceColleague.dto';
import { Res, Get, Put, Body, Post, Delete, Controller } from '@nestjs/common';

@Controller('workspaces')
export class WorkspacesController {
	constructor(
		private readonly socketGateway: SocketGateway,
		private readonly workspacesService: WorkspacesService
	) {}

	@Get()
	async getUserWorkspaces(
		@Res() res: Response,
		@Body() body: BaseWorkspaceDto
	) {
		try {
			const workspaces =
				await this.workspacesService.getUserWorkspaces(body);
			return res.status(200).json(workspaces);
		} catch (err: any) {
			console.log(err.message);
			return res.status(400).json({
				errorMessage: err.mssage
			});
		}
	}

	@Post()
	async createWorkspace(
		@Res() res: Response,
		@Body() body: CreateWorkspaceDto
	) {
		try {
			const workspace = await this.workspacesService.create(body);

			//generate the workspace room name
			const workspaceRoomName = generateWorkspaceRoomName(workspace.id);

			//get all colleagues (at this point its impossible that user has added themself)
			const colleaguesToAdd = Array.from(new Set(body.colleagues)).map(
				String
			);

			//Add users to room and emit event to all colleagues
			await Promise.all(
				colleaguesToAdd.map(async (userId) => {
					await this.socketGateway.addToRoom(
						userId,
						workspaceRoomName
					);
				})
			);

			//emit event for workspace created (to cause refetching)
			this.socketGateway.server
				.to(workspaceRoomName)
				.emit(EVENTS.WORKSPACE_CREATED);

			//emit event that will notify them (for notification)
			this.socketGateway.server
				.to(workspaceRoomName)
				.emit(EVENTS.NOTIFICATION, {
					message: `${body.userData.username} 
					has created and added you to workspace "${body.name}".`
				});

			//".to" excludes the sender
			//".in" includes everyone in the room

			//add the workspace owner to the room AFTER the events have been emitted
			await this.socketGateway.addToRoom(
				body.userData.id.toString(),
				workspaceRoomName
			);

			this.socketGateway.printRooms();

			return res.status(200).json({
				workspaceId: workspace.id,
				message: 'Workspace successfully created!'
			});
		} catch (err: any) {
			console.log(err.message);
			return res
				.status(err.response?.statusCode || 400)
				.json({ errorMessage: err.message });
		}
	}

	@Delete('/:workspaceId')
	async deleteWorkspace(
		@Res() res: Response,
		@Body() body: DeleteWorkspaceDto
	) {
		try {
			//extract boardIds before deletion
			const boardIds = await this.workspacesService.getWorkspaceBoardIds(
				body.workspaceData.id
			);

			const workspaceUserIds =
				await this.workspacesService.getWorkspaceUserIds(
					body.workspaceData.id,
					body.userData.id
				);

			//delete workspace
			await this.workspacesService.delete(body);

			//get all UNIQUE users with access to any board inside the workspace
			const boardRoomNames = boardIds.map((boardId) =>
				generateBoardRoomName(boardId)
			);

			const boardUsers = boardRoomNames.flatMap((boardRoomName) => {
				//get board room users
				const users = this.socketGateway.getRoomMembers(boardRoomName);

				//delete board room
				this.socketGateway.clearRoom(boardRoomName);

				return users; //this is string[] -> flatten === ...users
			});

			const uniqueBoardUsers = Array.from(
				new Set([...boardUsers, ...workspaceUserIds])
			).map(String);

			//generate a temporary room
			const tempRoomName = `pre-workspace-${body.workspaceData.id}-deletion`;
			await Promise.all(
				uniqueBoardUsers.map(async (userId) => {
					await this.socketGateway.addToRoom(userId, tempRoomName);
				})
			);

			//emit events
			this.socketGateway.server
				.to(tempRoomName)
				.emit(EVENTS.WORKSPACE_DELETED);

			if (boardRoomNames.length > 0) {
				this.socketGateway.server
					.to(tempRoomName)
					.emit(EVENTS.BOARD_DELETED);
			}

			this.socketGateway.server
				.to(tempRoomName)
				.emit(EVENTS.NOTIFICATION, {
					message: `${body.userData.username} has
				deleted workspace "${body.workspaceData.name}".`
				});

			//delete temp room
			this.socketGateway.clearRoom(tempRoomName);

			return res.status(200).json({
				message: 'Workspace successfully deleted!'
			});
		} catch (err: any) {
			console.log(err.message);
			return res
				.status(err.response?.statusCode || 400)
				.json({ errorMessage: err.message });
		}
	}

	@Get('/:workspaceId/details')
	async getWorkspaceById(
		@Body() body: GetWorkspaceDetails,
		@Res() res: Response
	) {
		try {
			const data = await this.workspacesService.getWorkspaceById(body);
			return res.status(200).json(data);
		} catch (err: any) {
			return res.status(400).json({ errorMessage: err.message });
		}
	}

	@Put('/:workspaceId/rename')
	async renameWorkspace(
		@Res() res: Response,
		@Body() body: RenameWorkspaceDto
	) {
		try {
			await this.workspacesService.rename(body);
			const workspaceRoomName = generateWorkspaceRoomName(
				body.workspaceData.id
			);
			const boardIds = await this.workspacesService.getWorkspaceBoardIds(
				body.workspaceData.id
			);
			const boardRoomNames = boardIds.map(generateBoardRoomName);

			const workspaceUserIds =
				this.socketGateway.getRoomMembers(workspaceRoomName);
			const boardUserIds = boardRoomNames.flatMap((boardRoomName) => {
				return this.socketGateway.getRoomMembers(boardRoomName);
			});

			const uniqueUsers = Array.from(
				new Set([...workspaceUserIds, ...boardUserIds])
			);

			//create temp room and fill it
			const tempRoomName = `pre-workspace-${body.workspaceData.id}-rename`;
			await Promise.all(
				uniqueUsers.map(async (userId) => {
					await this.socketGateway.addToRoom(userId, tempRoomName);
				})
			);

			//inform users
			this.socketGateway.server
				.to(tempRoomName)
				.emit(EVENTS.WORKSPACE_RENAMED);

			this.socketGateway.server
				.to(tempRoomName)
				.emit(EVENTS.NOTIFICATION, {
					message: `${body.userData.username} has renamed workspace 
					"${body.workspaceData.name}" to "${body.newName}".`
				});

			//delete temp room
			this.socketGateway.clearRoom(tempRoomName);

			return res.status(200).json({
				message: 'Workspace renamed successfully!'
			});
		} catch (err: any) {
			console.log(err.message);
			return res.status(400).json({
				errorMessage: err.message
			});
		}
	}

	@Post('/:workspaceId/colleagues')
	async addColleague(
		@Res() res: Response,
		@Body() body: EditWorkspaceColleagueDto
	) {
		try {
			const colleagueUsername =
				await this.workspacesService.addColleague(body);

			//get workspace and all board rooms inside that workspsace
			const boardRoomIds =
				await this.workspacesService.getWorkspaceBoardIds(
					body.workspaceData.id
				);

			const boardRoomNames = boardRoomIds.map(generateBoardRoomName);
			const workspaceRoomName = generateWorkspaceRoomName(
				body.workspaceData.id
			);

			//add the user to all of the rooms above
			await this.socketGateway.addToRoom(
				body.colleagueId.toString(),
				workspaceRoomName
			);

			await Promise.all(
				boardRoomNames.map(async (boardRoomName) => {
					await this.socketGateway.addToRoom(
						body.colleagueId.toString(),
						boardRoomName
					);
				})
			);

			//need to not duplicate notification so we create temp room
			const tempRoomName = `pre-workspace-${body.workspaceData.id}-colleague-addition`;

			const workspaceUserIds =
				this.socketGateway.getRoomMembers(workspaceRoomName);
			const boardUserIds = boardRoomNames.flatMap((boardRoomName) => {
				return this.socketGateway.getRoomMembers(boardRoomName);
			});

			const usersToInform = Array.from(
				new Set(
					[...workspaceUserIds, ...boardUserIds].filter(
						(userId) => userId !== body.userData.id.toString()
					)
				)
			);

			await Promise.all(
				usersToInform.map(async (userId) => {
					await this.socketGateway.addToRoom(userId, tempRoomName);
				})
			);

			//inform the users
			this.socketGateway.server
				.to(tempRoomName)
				.emit(EVENTS.WORKSPACE_COLLEAGUE_ADDED);

			this.socketGateway.server
				.to(tempRoomName)
				.emit(EVENTS.NOTIFICATION, {
					message: `${body.userData.username} has added
					 ${colleagueUsername} to workspace "${body.workspaceData.name}"`
				});

			//delete temp room
			this.socketGateway.clearRoom(tempRoomName);

			return res.status(200).json({
				message: 'Colleague added to workspace.'
			});
		} catch (err: any) {
			console.log(err.message);
			return res
				.status(err.response?.statusCode || 400)
				.json({ errorMessage: err.message });
		}
	}

	@Delete('/:workspaceId/colleagues')
	async removeColleague(
		@Res() res: Response,
		@Body() body: EditWorkspaceColleagueDto
	) {
		try {
			const colleagueUsername =
				await this.workspacesService.removeColleague(body);

			//get workspace and all board rooms inside that workspsace
			const boardRoomIds =
				await this.workspacesService.getWorkspaceBoardIds(
					body.workspaceData.id
				);

			const boardRoomNames = boardRoomIds.map(generateBoardRoomName);
			const workspaceRoomName = generateWorkspaceRoomName(
				body.workspaceData.id
			);

			//need to not duplicate notification so we create temp room
			const tempRoomName = `pre-workspace-${body.workspaceData.id}-colleague-deletion`;

			const workspaceUserIds =
				this.socketGateway.getRoomMembers(workspaceRoomName);
			const boardUserIds = boardRoomNames.flatMap((boardRoomName) => {
				return this.socketGateway.getRoomMembers(boardRoomName);
			});

			const usersToInform = Array.from(
				new Set(
					[...workspaceUserIds, ...boardUserIds].filter(
						(userId) => userId !== body.userData.id.toString()
					)
				)
			);

			await Promise.all(
				usersToInform.map(async (userId) => {
					await this.socketGateway.addToRoom(userId, tempRoomName);
				})
			);

			//inform the users
			this.socketGateway.server
				.to(tempRoomName)
				.emit(EVENTS.WORKSPACE_COLLEAGUE_DELETED);

			this.socketGateway.server
				.to(tempRoomName)
				.emit(EVENTS.NOTIFICATION, {
					message: `${body.userData.username} has removed
					 ${colleagueUsername} from workspace "${body.workspaceData.name}"`
				});

			//delete the removed user from all rooms
			await Promise.all(
				boardRoomNames.map(async (boardRoomName) => {
					await this.socketGateway.removeFromRoom(
						body.colleagueId.toString(),
						boardRoomName
					);
				})
			);

			await this.socketGateway.removeFromRoom(
				body.colleagueId.toString(),
				workspaceRoomName
			);

			//delete temp room
			this.socketGateway.clearRoom(tempRoomName);

			return res.status(200).json({
				message: 'Colleague removed from workspace.'
			});
		} catch (err: any) {
			console.log(err.message);
			return res
				.status(err.response?.statusCode || 400)
				.json({ errorMessage: err.message });
		}
	}
}
