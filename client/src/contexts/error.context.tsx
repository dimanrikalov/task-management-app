import { createContext, useContext, useEffect, useState } from 'react';


interface IErrorContext {
    errorMsg: string;
    showErrorMsg: boolean;
    showError(message: string): void;
}

const ErrorContext = createContext<IErrorContext>({
    errorMsg: '',
    showErrorMsg: false,
    showError: () => { },
});

export const useErrorContext = () => useContext<IErrorContext>(ErrorContext);

export const ErrorContextProvider: React.FC<{ children: React.ReactNode }> = ({
    children
}) => {
    const [errorMsg, setErrorMsg] = useState<string>('');
    const [showErrorMsg, setShowErrorMsg] = useState<boolean>(false);

    useEffect(() => {
        if (!showErrorMsg) return;
        const timeout = setTimeout(() => {
            setShowErrorMsg(false);
        }, 5000);

        return () => clearTimeout(timeout);
    }, [showErrorMsg])

    const showError = (message: string) => {
        setErrorMsg(message);
        setShowErrorMsg(true);
    }

    const data = {
        errorMsg,
        showError,
        showErrorMsg,
    };

    return (
        <ErrorContext.Provider value={data}>{children}</ErrorContext.Provider>
    );
};
