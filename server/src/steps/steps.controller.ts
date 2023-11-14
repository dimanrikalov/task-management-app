import { Response } from 'express';
import { StepsService } from './steps.service';
import { EditStepDto } from './dtos/editStep.dto';
import { DeleteStepDto } from './dtos/deleteStep.dto';
import { Body, Controller, Post, Res } from '@nestjs/common';

@Controller('steps')
export class StepsController {
    constructor(private readonly stepsService: StepsService) {}

    @Post('/edit')
    async edit(@Res() res: Response, @Body() body: EditStepDto) {
        try {
            await this.stepsService.edit(body);
            return res
                .status(200)
                .json({ message: 'Step updated successfully!' });
        } catch (err: any) {
            return res.status(400).json({
                errorMessage: err.message,
            });
        }
    }

    @Post('/delete')
    async delete(@Res() res: Response, @Body() body: DeleteStepDto) {
        try {
            this.stepsService.delete(body);
            return res
                .status(200)
                .json({ message: 'Step deleted successfully' });
        } catch (err: any) {
            return res.status(400).json({
                errorMessage: err.message,
            });
        }
    }
}
