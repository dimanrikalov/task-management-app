import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ViewModelReturnType } from '@/interfaces/viewModel.interface';

interface IBoardViewModelState {
	isChatOpen: boolean;
	isCreateTaskModalOpen: boolean;
	isDeleteBoardModalOpen: boolean;
	isEditBoardUsersModalOpen: boolean;
}

interface IBoardViewModelOperations {
	goBack(): void;
	toggleIsChatOpen(): void;
	toggleIsCreateTaskModalOpen(): void;
	toggleIsDeleteBoardModalOpen(): void;
	toggleIsEditBoardUsersModalOpen(): void;
}

export const useBoardViewModel = (): ViewModelReturnType<
	IBoardViewModelState,
	IBoardViewModelOperations
> => {
	const navigate = useNavigate();
	const [isChatOpen, setIsChatOpen] = useState(false);
	const [isEditBoardUsersModalOpen, setIsEditBoardUsersModalOpen] =
		useState(false);
	const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
	const [isDeleteBoardModalOpen, setIsDeleteBoardModalOpen] = useState(false);

	const toggleIsChatOpen = () => {
		setIsChatOpen((prev) => !prev);
	};

	const toggleIsEditBoardUsersModalOpen = () => {
		setIsEditBoardUsersModalOpen((prev) => !prev);
	};

	const toggleIsDeleteBoardModalOpen = () => {
		setIsDeleteBoardModalOpen((prev) => !prev);
	};

	const toggleIsCreateTaskModalOpen = () => {
		setIsCreateTaskModalOpen((prev) => !prev);
	};

	const goBack = () => {
		navigate(-1);
	};

	return {
		state: {
			isChatOpen,
			isCreateTaskModalOpen,
			isDeleteBoardModalOpen,
			isEditBoardUsersModalOpen,
		},
		operations: {
			goBack,
			toggleIsChatOpen,
			toggleIsCreateTaskModalOpen,
			toggleIsDeleteBoardModalOpen,
			toggleIsEditBoardUsersModalOpen,
		},
	};
};
