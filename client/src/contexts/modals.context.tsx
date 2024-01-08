import React, { createContext, useContext, useState } from 'react';

interface IModalsState {
    showEditProfileModal: boolean;
    showCreateBoardModal: boolean;
    showCreateWorkspaceModal: boolean;
}

interface IModalsContext {
    modalsState: IModalsState;
    toggleModal(key: keyof IModalsState): void;
}

const ModalsContext = createContext<IModalsContext>({
    toggleModal: () => { },
    modalsState: {
        showCreateBoardModal: false,
        showEditProfileModal: false,
        showCreateWorkspaceModal: false,
    },
});

export const useModalsContext = () => useContext<IModalsContext>(ModalsContext);

export const ModalsContextProvider: React.FC<{ children: React.ReactNode }> = ({
    children
}) => {
    const [modalsState, setModalsState] = useState<IModalsState>({
        showEditProfileModal: false,
        showCreateBoardModal: false,
        showCreateWorkspaceModal: false,
    });

    const toggleModal = (key: keyof IModalsState) => {
        setModalsState((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const data = {
        modalsState,
        toggleModal,
    };

    return (
        <ModalsContext.Provider value={data}>{children}</ModalsContext.Provider>
    );
};
