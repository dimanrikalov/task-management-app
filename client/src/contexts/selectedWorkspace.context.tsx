import { createContext, useContext, useState } from 'react';


interface ISelectedWorkspaceContext {
    workspaceName: string;
    clearWorkspaceName(): void;
    setWorkspaceName: React.Dispatch<React.SetStateAction<string>>
}

const SelectedWorkspaceContext = createContext<ISelectedWorkspaceContext>({
    workspaceName: '',
    setWorkspaceName: () => { },
    clearWorkspaceName: () => { }
});

export const useSelectedWorkspaceContext = () => useContext<ISelectedWorkspaceContext>(SelectedWorkspaceContext);

export const SelectedWorkspaceContextProvider: React.FC<{ children: React.ReactNode }> = ({
    children
}) => {
    const [workspaceName, setWorkspaceName] = useState<string>('');

    const clearWorkspaceName = () => {
        setWorkspaceName('');
    }

    const data = {
        workspaceName,
        setWorkspaceName,
        clearWorkspaceName
    };

    return (
        <SelectedWorkspaceContext.Provider value={data}>{children}</SelectedWorkspaceContext.Provider>
    );
};
