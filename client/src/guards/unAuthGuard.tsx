import { extractTokens } from "@/utils";
import { Navigate, Outlet } from "react-router-dom";

export const UnAuthGuard = () => {
    const { accessToken } = extractTokens();


    if (accessToken) {
        return <Navigate to={'/dashboard'} />
    }

    return <Outlet />
}