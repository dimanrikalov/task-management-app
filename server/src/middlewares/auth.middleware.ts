import {
	Injectable,
	NestMiddleware,
	UnauthorizedException
} from '@nestjs/common';
import { IJWTPayload } from 'src/jwt/jwt.interfaces';
import { extractJWTData } from 'src/jwt/extractJWTData';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { validateJWTToken } from 'src/jwt/validateJWTToken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
	constructor(private readonly prismaService: PrismaService) {}

	async use(req: Request, res: Response, next: NextFunction) {
		try {
			const authorizationHeader = req.headers.authorization;
			if (!authorizationHeader) {
				throw new UnauthorizedException('Unauthorized access!');
			}
			const authorizationToken = authorizationHeader.split(' ')[1];

			// Verify the JWT token is valid
			if (!validateJWTToken(authorizationToken)) {
				throw new UnauthorizedException('Invalid JWT token!');
			}

			// Decode the JWT token
			const decodedToken: IJWTPayload =
				extractJWTData(authorizationToken);

			// check if the token is valid by checking if user with same id exists
			const user = await this.prismaService.user.findUnique({
				where: {
					id: decodedToken.id
				}
			});

			if (!user.id) {
				throw new UnauthorizedException('Invalid JWT token!');
			}

			//add the decodedUserData to the body
			req.body.userData = user;

			//proceed accessing the endpoint
			next();
		} catch (err: any) {
			console.log(err.message);
			return res.status(401).json({ errorMessage: err.message });
		}
	}
}
