import { createContext, useEffect, useState } from "react";

interface IErrorContextProviderProps {
    children: React.ReactNode;
}

export interface IErrorContext {
    error: string;
    showErrorMsg: boolean;
    setErrorMessage(message: string): void;
}

export const ErrorContext = createContext<IErrorContext>({
    error: '',
    showErrorMsg: false,
    setErrorMessage: () => { },
});


export const ErrorContextProvider = ({ children }: IErrorContextProviderProps) => {
    const [errorMsg, setErrorMsg] = useState<string>('');
    const [showErrorMsg, setShowErrorMsg] = useState<boolean>(false);

    useEffect(() => {
        if (!errorMsg) {
            setShowErrorMsg(false);
        }

        const interval = setInterval(() => {
            setShowErrorMsg(false);
        }, 5000);

        return () => clearInterval(interval);
    }, [errorMsg, showErrorMsg]);

    const setErrorMessage = (message: string) => {
        setErrorMsg(message);
        setShowErrorMsg(true);
    }

    return (
        <ErrorContext.Provider value={{
            showErrorMsg,
            error: errorMsg,
            setErrorMessage,
        }}>
            {children}
        </ErrorContext.Provider>
    )
}
