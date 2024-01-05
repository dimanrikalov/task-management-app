import { createSlice } from '@reduxjs/toolkit';

export interface IUserData {
    id: number;
    email: string;
    lastName: string;
    firstName: string;
    profileImg: Buffer;
    profileImagePath: string;
}

export interface IUserSlice {
    accessToken: string;
    data: IUserData | null;
}

const initialState: IUserSlice = {
    accessToken: '',
    data: null
};

const modalsSlice = createSlice({
    name: 'user-slice',
    initialState,
    reducers: {
        setUserData: (_, action) => action.payload,
        clearUserData: () => ({ accessToken: '', data: null })
    }
});

export const { setUserData, clearUserData } = modalsSlice.actions;

export default modalsSlice.reducer;
