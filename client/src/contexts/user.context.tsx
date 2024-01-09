import { deleteTokens } from "@/utils";
import { createContext, useContext, useState } from "react";

export interface IUserData {
    id: number;
    email: string;
    lastName: string;
    firstName: string;
    profileImg: Buffer;
    profileImagePath: string;
}

interface ISetUserDataPayload {
    accessToken: string;
    data: IUserData | null;
}

interface IUserContext {
    logout(): void;
    accessToken: string;
    data: IUserData | null;
    setUserData(data: ISetUserDataPayload): void;
}

export interface IUserContextSecure {
    logout(): void;
    data: IUserData;
    accessToken: string;
    setUserData(data: ISetUserDataPayload): void;
}

const UserContext = createContext<IUserContext>({
    data: null,
    accessToken: '',
    logout: () => { },
    setUserData: () => { }
});

export const useUserContext = () => useContext<IUserContext>(UserContext);

/*
decode token check exp date and compare to date now, if expired make request to 
refresh tokens they will be set as cookies automatically, set tokens as cookies as well
*/
export const UserContextProvider: React.FC<{ children: React.ReactNode }> = ({
    children
}) => {
    const [data, setData] = useState<IUserData | null>(null);
    const [accessToken, setAccessToken] = useState<string>('');

    const setUserData = (data: ISetUserDataPayload) => {
        if (data.data) {
            setData({ ...data.data });
        } else {
            setData(null);
        }
        setAccessToken(data.accessToken);
    };

    const logout = () => {
        deleteTokens();
    };

    const value = {
        data,
        logout,
        accessToken,
        setUserData
    };
    return (
        <UserContext.Provider value={value}>{children}</UserContext.Provider>
    );
};
