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

			//Emit event to all colleagues
			const newlyAddedUserIds = Array.from(
				new Set([...body.colleagues, body.userData.id])
			);

			newlyAddedUserIds.forEach((userId) => {
				this.socketGateway.addToRoom(
					userId.toString(),
					workspaceRoomName
				);
			});

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

			this.socketGateway.printRooms();

			return res.status(200).json({
				workspaceId: workspace.id,
				message: 'Workspace successfully created!'
			});
		} catch (err: any) {
			console.log(err.message);
			const { statusCode, message: errorMessage } = err.response;
			return res.status(statusCode || 400).json({ errorMessage });
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
				this.socketGateway.server
					.in(boardRoomName)
					.socketsLeave(boardRoomName);

				return users; //this is string[] -> flat === ...users
			});

			const uniqueBoardUsers = Array.from(
				new Set([...boardUsers, ...workspaceUserIds])
			);

			//generate a temporary room
			const tempRoomName = `pre-workspace-${body.workspaceData.id}-deletion`;
			uniqueBoardUsers.forEach((userId) => {
				this.socketGateway.addToRoom(userId.toString(), tempRoomName);
			});

			//emit events
			this.socketGateway.server
				.to(tempRoomName)
				.emit(EVENTS.WORKSPACE_DELETED);

			this.socketGateway.server
				.to(tempRoomName)
				.emit(EVENTS.NOTIFICATION, {
					message: `${body.userData.username} has
				deleted workspace "${body.workspaceData.name}".`
				});

			//delete temp room
			this.socketGateway.server
				.in(tempRoomName)
				.socketsLeave(tempRoomName);

			return res.status(200).json({
				message: 'Workspace successfully deleted!'
			});
		} catch (err: any) {
			console.log(err.message);
			const { statusCode, message: errorMessage } = err.response;
			return res.status(statusCode || 400).json({ errorMessage });
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
			//extract boardIds
			const boardIds = await this.workspacesService.getWorkspaceBoardIds(
				body.workspaceData.id
			);

			const workspaceUserIds =
				await this.workspacesService.getWorkspaceUserIds(
					body.workspaceData.id,
					body.userData.id
				);

			//get all UNIQUE users with access to any board inside the workspace
			const boardRoomNames = boardIds.map((boardId) =>
				generateBoardRoomName(boardId)
			);

			const boardUsers = boardRoomNames.flatMap((boardRoomName) => {
				//get board room users
				const users = this.socketGateway.getRoomMembers(boardRoomName);

				//delete board room
				this.socketGateway.server
					.in(boardRoomName)
					.socketsLeave(boardRoomName);

				return users; //this is string[] -> flat === ...users
			});

			const uniqueBoardUsers = Array.from(
				new Set([...boardUsers, ...workspaceUserIds])
			);

			//generate a temporary room
			const tempRoomName = `pre-workspace-${body.workspaceData.id}-update`;
			uniqueBoardUsers.forEach((userId) => {
				this.socketGateway.addToRoom(userId.toString(), tempRoomName);
			});

			//emit events
			this.socketGateway.server
				.to(tempRoomName)
				.emit(EVENTS.WORKSPACE_RENAMED);

			this.socketGateway.server
				.to(tempRoomName)
				.emit(EVENTS.NOTIFICATION, {
					message: `${body.userData.username} has renamed 
					workspace "${body.workspaceData.name}" to "${body.newName}".`
				});

			//delete temp room
			this.socketGateway.server
				.in(tempRoomName)
				.socketsLeave(tempRoomName);

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

			//extract boardIds
			const boardIds = await this.workspacesService.getWorkspaceBoardIds(
				body.workspaceData.id
			);

			//extract the userid after adding them to the workspace
			const workspaceUserIds =
				await this.workspacesService.getWorkspaceUserIds(
					body.workspaceData.id,
					body.userData.id
				);

			//get all UNIQUE users with access to any board inside the workspace
			const boardRoomNames = boardIds.map((boardId) =>
				generateBoardRoomName(boardId)
			);

			const boardUsers = boardRoomNames.flatMap((boardRoomName) => {
				//get board room users
				const users = this.socketGateway.getRoomMembers(boardRoomName);

				//delete board room
				this.socketGateway.server
					.in(boardRoomName)
					.socketsLeave(boardRoomName);

				return users; //this is string[] -> flat === ...users
			});

			const uniqueBoardUsers = Array.from(
				new Set([...boardUsers, ...workspaceUserIds])
			);

			//generate a temporary room
			const tempRoomName = `pre-workspace-${body.workspaceData.id}-colleague-addition`;
			uniqueBoardUsers.forEach((userId) => {
				this.socketGateway.addToRoom(userId.toString(), tempRoomName);
			});

			//emit events
			this.socketGateway.server
				.to(tempRoomName)
				.emit(EVENTS.WORKSPACE_COLLEAGUE_ADDED);

			this.socketGateway.server
				.to(tempRoomName)
				.emit(EVENTS.NOTIFICATION, {
					message: `${body.userData.username} has added
					 ${colleagueUsername} to workspace "${body.workspaceData.name}".`
				});

			//delete temp room
			this.socketGateway.server
				.in(tempRoomName)
				.socketsLeave(tempRoomName);

			return res.status(200).json({
				message: 'Colleague added to workspace.'
			});
		} catch (err: any) {
			console.log(err.message);
			const { statusCode, message: errorMessage } = err.response;
			return res.status(statusCode || 400).json({ errorMessage });
		}
	}

	@Delete('/:workspaceId/colleagues')
	async removeColleague(
		@Res() res: Response,
		@Body() body: EditWorkspaceColleagueDto
	) {
		try {
			//extract boardIds
			const boardIds = await this.workspacesService.getWorkspaceBoardIds(
				body.workspaceData.id
			);

			const workspaceUserIds =
				await this.workspacesService.getWorkspaceUserIds(
					body.workspaceData.id,
					body.userData.id
				);

			// remove the colleague only after their id is extracted
			const colleagueUsername =
				await this.workspacesService.removeColleague(body);

			//get all UNIQUE users with access to any board inside the workspace
			const boardRoomNames = boardIds.map((boardId) =>
				generateBoardRoomName(boardId)
			);

			const boardUsers = boardRoomNames.flatMap((boardRoomName) => {
				//get board room users
				const users = this.socketGateway.getRoomMembers(boardRoomName);

				//delete board room
				this.socketGateway.server
					.in(boardRoomName)
					.socketsLeave(boardRoomName);

				return users; //this is string[] -> flat === ...users
			});

			const uniqueBoardUsers = Array.from(
				new Set([...boardUsers, ...workspaceUserIds])
			);

			//generate a temporary room
			const tempRoomName = `pre-workspace-${body.workspaceData.id}-colleague-deletion`;
			uniqueBoardUsers.forEach((userId) => {
				this.socketGateway.addToRoom(userId.toString(), tempRoomName);
			});

			//emit events
			this.socketGateway.server
				.to(tempRoomName)
				.emit(EVENTS.WORKSPACE_COLLEAGUE_ADDED);

			this.socketGateway.server
				.to(tempRoomName)
				.emit(EVENTS.NOTIFICATION, {
					message: `${body.userData.username} has removed
					 ${colleagueUsername} from workspace "${body.workspaceData.name}".`
				});

			//delete temp room
			this.socketGateway.server
				.in(tempRoomName)
				.socketsLeave(tempRoomName);

			return res.status(200).json({
				message: 'Colleague removed from workspace.'
			});
		} catch (err: any) {
			console.log(err.message);
			const { statusCode, message: errorMessage } = err.response;
			return res.status(statusCode || 400).json({ errorMessage });
		}
	}
}
