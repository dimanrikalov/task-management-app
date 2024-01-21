import { IJWTPayload } from 'src/jwt/jwt.interfaces';

interface IUserData {
	userData: IJWTPayload;
}

export interface IRefreshTokensBody {
	payload: IUserData;
	refreshToken: string;
}
