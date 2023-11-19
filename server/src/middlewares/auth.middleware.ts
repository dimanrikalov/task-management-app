import { IJWTPayload } from 'src/jwt/jwt.interfaces';
import { extractJWTData } from 'src/jwt/extractJWTData';
import { Request, Response, NextFunction } from 'express';
import { validateJWTToken } from 'src/jwt/validateJWTToken';
import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        try {
            const authorizationHeader = req.headers.authorization;
            if (!authorizationHeader) {
                throw new Error('Unauthorized access!');
            }
            const authorizationToken = authorizationHeader.split(' ')[1];

            // Verify the JWT token is valid
            if (!validateJWTToken(authorizationToken)) {
                throw new Error('Invalid JWT token!');
            }

            // Decode the JWT token
            const decodedToken: IJWTPayload =
                extractJWTData(authorizationToken);

            //add the decodedUserData to the body
            req.body.userData = decodedToken;

            //proceed accessing the endpoint
            next();
        } catch (err: any) {
            return res.status(401).json({ errorMessage: err.message });
        }
    }
}
