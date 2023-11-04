import {
    MessageBody,
    WebSocketServer,
    SubscribeMessage,
    WebSocketGateway,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway(3003, { cors: '*' })
export class BoardsGateway {
    @WebSocketServer()
    server: Server;

    @SubscribeMessage('boardCreated')
    handleBoardCreated(@MessageBody() payload: any) {
        // Handle the 'boardCreated' event
        // You can broadcast the event to all connected clients or specific users
        this.server.emit('boardCreated', payload);
    }

    @SubscribeMessage('userAddedToBoard')
    handleUserAddedToBoard(@MessageBody() payload: any) {
        // Handle the 'userAddedToBoard' event
        // You can broadcast the event to all connected clients or specific users
        this.server.emit('userAddedToBoard', payload);
    }
}