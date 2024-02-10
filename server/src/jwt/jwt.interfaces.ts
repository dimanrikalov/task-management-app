export interface IJWTPayload {
	id: number;
	iat?: number;
	exp?: number;
}

interface ISuccessfulResponse {
	accessToken: string;
}

interface IFailedResponse {
	errorMessage: string;
}

export type TRefreshTokenResponse = ISuccessfulResponse | IFailedResponse;

export interface IGenerateTokens {
	accessToken: string;
	refreshToken: string;
}

export interface IRefreshTokenPayload {
	id: number;
	exp: number;
}
