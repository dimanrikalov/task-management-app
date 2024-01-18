import { Response } from 'express';
import { BaseNotificationsDto } from './dtos/base.dto';
import { NotificationsService } from './notifications.service';
import { Body, Controller, Delete, Get, Res } from '@nestjs/common';
import { DeleteNotificationDto } from './dtos/deleteNotifications.dto';

@Controller('notifications')
export class NotificationsController {
	constructor(private readonly notificationsService: NotificationsService) {}

	@Get()
	async getAll(@Res() res: Response, @Body() body: BaseNotificationsDto) {
		try {
			const notifications = await this.notificationsService.getAll(body);
			return res.status(200).json(notifications);
		} catch (err: any) {
			console.log(err.message);
			return res.status(400).json({
				errorMessage: err.message
			});
		}
	}

	@Delete('/:notificationId')
	async delete(@Res() res: Response, @Body() body: DeleteNotificationDto) {
		try {
			await this.notificationsService.deleteNotification(
				body.notificationData.id
			);
		} catch (err: any) {
			console.log(err.message);
			return res.status(400).json({
				errorMessage: err.message
			});
		}
	}
}
