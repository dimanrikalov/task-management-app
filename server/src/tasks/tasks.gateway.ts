import {
	MessageBody,
	WebSocketServer,
	SubscribeMessage,
	WebSocketGateway
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway(3004, { cors: '*' })
export class TasksGateway {
	@WebSocketServer()
	server: Server;

	@SubscribeMessage('taskCreated')
	handleTaskCreated(@MessageBody() payload: any) {
		// Handle the 'workspaceCreated' event
		// You can broadcast the event to all connected clients or specific users
		this.server.emit('taskCreated', payload);
	}
}
