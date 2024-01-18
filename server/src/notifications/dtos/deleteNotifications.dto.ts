import { Notification } from '@prisma/client';
import { BaseNotificationsDto } from './base.dto';

export class DeleteNotificationDto extends BaseNotificationsDto {
	notificationData: Notification;
}
