import {
	WebSocketServer,
	WebSocketGateway,
	OnGatewayDisconnect,
	OnGatewayConnection
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { extractJWTData } from 'src/jwt/extractJWTData';
import { PrismaService } from 'src/prisma/prisma.service';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

interface ClientData {
	userId: number;
	socketId: string;
	socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
}

export const generateWorkspaceRoomName = (workspaceId: number) => {
	return `workspace-${workspaceId}`;
};

export const generateBoardRoomName = (boardId: number) => {
	return `board-${boardId}`;
};

export enum EVENTS {
	ANY = '*',
	USER_CREATED = 'userCreated',
	NOTIFICATION = 'notification',
	BOARD_CREATED = 'boardCreated',
	BOARD_DELETED = 'boardDeleted',
	WORKSPACE_CREATED = 'workspaceCreated',
	WORKSPACE_DELETED = 'workspaceDeleted',
	WORKSPACE_RENAMED = 'workspaceRenamed',
	WORKSPACE_COLLEAGUE_ADDED = 'workspaceColleagueAdded',
	WORKSPACE_COLLEAGUE_DELETED = 'workspaceColleagueDeleted'
}

@WebSocketGateway({ cors: true })
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer() server: Server;
	clients: { [key: string]: ClientData } = {}; // In-memory database

	constructor(private readonly prismaService: PrismaService) {}

	async handleConnection(client: Socket) {
		// Extract user ID from authentication token or other means
		const userId = extractJWTData(
			client.handshake.headers.authorization
		).id;

		// Fetch user data from the database
		const user = await this.prismaService.user.findUnique({
			where: { id: userId }
		});

		// Check if the user has access to any workspaces
		const accessibleWorkspaces =
			await this.prismaService.workspace.findMany({
				where: {
					OR: [
						{
							ownerId: user.id
						},
						{
							User_Workspace: {
								some: {
									userId: user.id
								}
							}
						}
					]
				}
			});

		//Check if user has access to any boards
		const accessibleBoards = await this.prismaService.board.findMany({
			where: {
				OR: [
					{
						// Boards related to workspaces where the user has access
						Workspace: {
							User_Workspace: {
								some: {
									userId: user.id
								}
							}
						}
					},
					{
						// Boards where the user is the workspace creator
						Workspace: {
							ownerId: user.id
						}
					},
					{
						// Boards where the user has direct access
						User_Board: {
							some: {
								userId: user.id
							}
						}
					}
				]
			}
		});

		// Create/Join each accessible workspace room
		await Promise.all(
			accessibleWorkspaces.map(async (workspace) => {
				await client.join(generateWorkspaceRoomName(workspace.id));
			})
		);

		// Create/Join each accessible board room
		await Promise.all(
			accessibleBoards.map(async (board) => {
				await client.join(generateBoardRoomName(board.id));
			})
		);

		//Add client entry inside server list of connections (stored only while the server is up)
		this.clients[user.id] = {
			socket: client,
			userId: user.id,
			socketId: client.id
		};

		// console.log(this.clients);

		console.log(
			'Workspace rooms created:',
			accessibleWorkspaces
				.map((workspace) => `workspace-${workspace.id}`)
				.join(', ')
		);

		console.log(
			'Boards rooms created:',
			accessibleBoards.map((board) => `board-${board.id}`).join(', ')
		);

		client.emit('connected', {
			message: 'You are now connected!',
			user: {
				userId: user.id,
				username: user.username
				// Add any other user data you want to send
			}
		});
	}

	handleDisconnect(client: Socket) {
		// Remove client data on disconnect
		const user = this.getUserBySocketId(client.id);

		if (user) {
			delete this.clients[user.userId];
		}
	}

	addToRoom(clientId: string, roomId: string) {
		const clientSocket = this.clients[clientId];
		if (!clientSocket) return;
		//add client to the room
		clientSocket.socket.join(roomId);
	}

	printRooms() {
		console.log(this.server.sockets.adapter.rooms);
	}

	getRoomMembers(roomId: string) {
		const room = this.server.sockets.adapter.rooms.get(roomId);
		if (!room) return [];

		const socketIds = Array.from(room);

		return Object.entries(this.clients).map(([key, value]) => {
			console.log(key, value);
			if (socketIds.some((socketId) => socketId === value.socketId)) {
				return key;
			}
		});
	}

	private getUserBySocketId(socketId: string): ClientData | undefined {
		return Object.values(this.clients).find(
			(client) => client.socket.id === socketId
		);
	}
}
