export interface IJWTPayload {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
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
    userId: number;
    exp: number;
}
