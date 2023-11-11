import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ViewModelReturnType } from '@/interfaces/viewModel.interface';

interface IUseHomeViewmodelState {
	isCreateBoardModalOpen: boolean;
	isEditProfileModalOpen: boolean;
	isCreateWorkspaceModalOpen: boolean;
}

interface IUserHomeViewmodelOperations {
	goToBoard(): void;
	toggleCreateBoardModal(): void;
	toggleEditProfileModal(): void;
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
	const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);

	const toggleCreateWorkspaceModal = () => {
		setIsCreateWorkspaceModalOpen((prev) => !prev);
	};

	const toggleCreateBoardModal = () => {
		setIsCreateBoardModalOpen((prev) => !prev);
	};

	const toggleEditProfileModal = () => {
		setIsEditProfileModalOpen((prev) => !prev);
	};

	const goToBoard = () => {
		navigate('/board');
	};

	return {
		state: {
			isCreateBoardModalOpen,
			isEditProfileModalOpen,
			isCreateWorkspaceModalOpen,
		},
		operations: {
			goToBoard,
			toggleEditProfileModal,
			toggleCreateBoardModal,
			toggleCreateWorkspaceModal,
		},
	};
};
