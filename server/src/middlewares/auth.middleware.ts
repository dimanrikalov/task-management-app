import { IJWTPayload } from 'src/jwt/jwt.interfaces';
import { extractJWTData } from 'src/jwt/extractJWTData';
import { Request, Response, NextFunction } from 'express';
import { validateJWTToken } from 'src/jwt/validateJWTToken';
import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const authorizationHeader = req.headers.authorization;

        if (!authorizationHeader) {
            return res.status(401).json({ message: 'Unauthorized access!' });
        }

        const authorizationToken = authorizationHeader.split(' ')[1];

        try {
            // Verify the JWT token is valid
            if (!validateJWTToken(authorizationToken)) {
                throw new Error('Invalid JWT token.');
            }

            // Decode the JWT token
            const decodedToken: IJWTPayload =
                extractJWTData(authorizationToken);

            //add the decodedUserData to the body
            req.body.userData = decodedToken;
            next();
        } catch (err: any) {
            return res.status(401).json({ errorMessage: err.message });
        }
    }
}
