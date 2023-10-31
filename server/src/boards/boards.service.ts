import * as jwt from 'jsonwebtoken';
import { Board } from '../models/board.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateBoardDto } from './dtos/create-board.dto';
import { IJWTPayload } from 'src/interfaces/IJWTPayload.interface';

@Injectable()
export class BoardsService {
    // constructor(@InjectModel(Board) private boardModel: typeof Board) {}
    // async create(body: CreateBoardDto) {
    //     try {
    //         const isValidToken = jwt.verify(body.authorization_token, process.env.JWT_SECRET);
    //         //check if is valid?

    //         //extract the id out of the token
    //         const data: IJWTPayload | null = jwt.decode(body.authorization_token) as IJWTPayload | null;

    //         //if workspace_id is provided verify that workspace exists and find its owner_id
    //         let workspace;
    //         if(body.workspace_id) {

    //         }

    //         this.boardModel.create({
    //             name: body.name,
    //             owner_id: body.workspace_id ? workspace.owner_id : data.id,
    //             workspace_id: body.workspace_id || null
    //         })


    //     } catch (err: any) {
    //         console.log(err);
    //     }
    // }
}
