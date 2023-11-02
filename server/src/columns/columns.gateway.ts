import {
    MessageBody,
    WebSocketServer,
    SubscribeMessage,
    WebSocketGateway,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway(3004, { cors: '*' })
export class ColumnsGateway {
    @WebSocketServer()
    server: Server;

    @SubscribeMessage('columnCreated')
    handleColumnCreated(@MessageBody() payload: any) {
        // Handle the 'columnCreated' event
        // You can broadcast the event to all connected clients or specific users
        this.server.emit('columnCreated', payload);
    }
}