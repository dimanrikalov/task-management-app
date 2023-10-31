import {
    MessageBody,
    WebSocketServer,
    SubscribeMessage,
    WebSocketGateway,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(3002, { cors: '*' })
export class WorkspacesGateway {
    @WebSocketServer()
    server: Server;

    @SubscribeMessage('workspaceCreated')
    handleWorkspaceCreated(@MessageBody() payload: any) {
        // Handle the 'workspaceCreated' event
        // You can broadcast the event to all connected clients or specific users
        this.server.emit('workspaceCreated', payload);
    }
}