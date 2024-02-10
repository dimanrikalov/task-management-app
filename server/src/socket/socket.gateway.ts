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
	TASK_MOVED = 'taskMoved',
	MESSAGE_SENT = 'messageSent',
	TASK_CREATED = 'taskCreated',
	TASK_DELETED = 'taskDeleted',
	COLUMN_MOVED = 'columnMoved',
	USER_CREATED = 'userCreated',
	USER_DELETED = 'userDeleted',
	TASK_MODIFIED = 'taskModifed',
	NOTIFICATION = 'notification',
	BOARD_CREATED = 'boardCreated',
	BOARD_RENAMED = 'boardRenamed',
	BOARD_DELETED = 'boardDeleted',
	COLUMN_RENAMED = 'columnRenamed',
	COLUMN_DELETED = 'columnDeleted',
	COLUMN_CREATED = 'columnCreated',
	WORKSPACE_CREATED = 'workspaceCreated',
	WORKSPACE_RENAMED = 'workspaceRenamed',
	WORKSPACE_DELETED = 'workspaceDeleted',
	BOARD_COLLEAGUE_ADDED = 'boardColleagueAdded',
	BOARD_COLLEAGUE_DELETED = 'boardColleagueDeleted',
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

		//Add client entry inside server list of connections (stored only while the server is up)
		this.clients[user.id.toString()] = {
			socket: client,
			userId: user.id,
			socketId: client.id
		};

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
				const workspaceRoomName = generateWorkspaceRoomName(
					workspace.id
				);
				await this.addToRoom(user.id.toString(), workspaceRoomName);
			})
		);

		// Create/Join each accessible board room
		await Promise.all(
			accessibleBoards.map(async (board) => {
				const boardRoomName = generateBoardRoomName(board.id);
				await this.addToRoom(user.id.toString(), boardRoomName);
			})
		);

		this.printRooms();

		client.emit('connected', {
			message: 'You are now connected!',
			user: {
				userId: user.id,
				username: user.username
			}
		});
	}

	async handleDisconnect(client: Socket) {
		// Remove client data on disconnect
		const user = this.getUserBySocketId(client.id);

		//remove from rooms
		const rooms = Array.from(this.server.sockets.adapter.rooms.keys());

		await Promise.all(
			rooms.map(async (room) => {
				console.log(room);
				await this.removeFromRoom(user?.userId.toString(), room);
			})
		);

		if (user) {
			delete this.clients[user.userId.toString()];
		}
	}

	async addToRoom(clientId: string, roomId: string) {
		const clientSocket = this.clients[clientId];
		if (!clientSocket) return;
		//add client to the room
		await clientSocket.socket.join(roomId);
	}

	async removeFromRoom(clientId: string, roomId: string) {
		const clientSocket = this.clients[clientId];
		if (!clientSocket) return;
		//remove client from the room
		await clientSocket.socket.leave(roomId);
	}

	printRooms() {
		const rooms = this.server.sockets.adapter.rooms;

		rooms.forEach((_, roomId) => {
			console.log(`Room: ${roomId}`);
			const clients = this.getRoomMembers(roomId);
			clients.forEach((clientId: string) => {
				if (clientId) {
					const client = this.clients[clientId];
					console.log(
						`Client ID: ${clientId}, User ID: ${client.userId}`
					);
				}
			});
		});
	}

	getRoomMembers(roomId: string) {
		const room = this.server.sockets.adapter.rooms.get(roomId);
		if (!room) return [];

		const socketIds = Array.from(room);

		return Object.entries(this.clients).map(([key, value]) => {
			if (socketIds.some((socketId) => socketId === value.socketId)) {
				return key;
			}
		});
	}

	clearRoom(roomName: string) {
		this.server.in(roomName).socketsLeave(roomName);
	}

	private getUserBySocketId(socketId: string): ClientData | undefined {
		return Object.values(this.clients).find(
			(client) => client.socket.id === socketId
		);
	}
}
