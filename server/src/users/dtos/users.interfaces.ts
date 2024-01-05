import { BaseUsersDto } from './base.dto';

export interface IRefreshTokensBody {
    payload: BaseUsersDto;
    refreshToken: string;
}
