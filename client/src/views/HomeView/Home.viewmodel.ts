import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ViewModelReturnType } from '@/interfaces/viewModel.interface';

interface IUseHomeViewmodelState {
	isCreateBoardModalOpen: boolean;
	isCreateWorkspaceModalOpen: boolean;
}

interface IUserHomeViewmodelOperations {
	toggleCreateBoardModal(): void;
	toggleCreateWorkspaceModal(): void;
}

export const useHomeViewModel = (): ViewModelReturnType<
	IUseHomeViewmodelState,
	IUserHomeViewmodelOperations
> => {
	const navigate = useNavigate();
	const [isCreateWorkspaceModalOpen, setIsCreateWorkspaceModalOpen] =
		useState(false);
	const [isCreateBoardModalOpen, setIsCreateBoardModalOpen] = useState(false);

	const toggleCreateWorkspaceModal = () => {
		setIsCreateWorkspaceModalOpen((prev) => !prev);
	};

	const toggleCreateBoardModal = () => {
		setIsCreateBoardModalOpen((prev) => !prev);
	};

	return {
		state: { isCreateBoardModalOpen, isCreateWorkspaceModalOpen },
		operations: {
			toggleCreateBoardModal,
			toggleCreateWorkspaceModal,
		},
	};
};
