import { Injectable } from '@nestjs/common';
import { BaseNotificationsDto } from './dtos/base.dto';
import { PrismaService } from 'src/prisma/prisma.service';

interface ICreateNotification {
	userId: number;
	message: string;
}

@Injectable()
export class NotificationsService {
	constructor(private readonly prismaService: PrismaService) {}

	async getAll(body: BaseNotificationsDto) {
		return await this.prismaService.notification.findMany({
			where: {
				userId: body.userData.id
			},
			orderBy: {
				timestamp: 'desc'
			}
		});
	}

	async addNotification({ userId, message }: ICreateNotification) {
		await this.prismaService.notification.create({
			data: {
				userId,
				message,
				timestamp: new Date(Date.now())
			}
		});
	}

	async deleteNotification(notificationId: number) {
		await this.prismaService.notification.delete({
			where: {
				id: notificationId
			}
		});
	}

	async deleteAllNotifications(userId: number) {
		await this.prismaService.notification.deleteMany({
			where: {
				userId
			}
		});
	}
}
