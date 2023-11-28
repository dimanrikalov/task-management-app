import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ViewModelReturnType } from '@/interfaces/viewModel.interface';
import {
	deleteTokens,
	extractTokens,
	isAccessTokenValid,
	refreshTokens,
} from '@/utils';
import { jwtDecode } from 'jwt-decode';
interface IUseHomeViewmodelState {
	boards: any[];
	userData: any[];
	workspaces: any[];
	isCreateBoardModalOpen: boolean;
	isEditProfileModalOpen: boolean;
	isCreateWorkspaceModalOpen: boolean;
}

interface IUserHomeViewmodelOperations {
	logout(): void;
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
	const [boards, setBoards] = useState([]);
	const [workspaces, setWorkspaces] = useState([]);
	const [isCreateWorkspaceModalOpen, setIsCreateWorkspaceModalOpen] =
		useState(false);
	const [isCreateBoardModalOpen, setIsCreateBoardModalOpen] = useState(false);
	const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);

	const { accessToken } = extractTokens();
	if (!isAccessTokenValid(accessToken)) {
		refreshTokens();
	}
	const userData = jwtDecode(accessToken) as any;
	console.log(userData)
	//check if the accessToken has expired
	//if yes update it
	//fetch workspaces and boards
	useEffect(() => {
		try {
			getUserBoards(accessToken);
			getUserWorkspaces(accessToken);
		} catch (err: any) {
			console.log(err.message);
			navigate('/');
		}
	}, []);

	const logout = () => {
		deleteTokens();
		navigate('/');
	};

	const getUserWorkspaces = async (accessToken: string) => {
		try {
			const res = await fetch(
				`${import.meta.env.VITE_SERVER_URL}/workspaces`,
				{
					method: 'GET',
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				}
			);
			const workspaces = await res.json();
			setWorkspaces(workspaces);
		} catch (err: any) {
			console.log(err.message);
			if (
				['Unauthorized access!', 'Invalid JWT token!'].includes(
					err.message
				)
			) {
				navigate('/');
			}
		}
	};

	const getUserBoards = async (accessToken: string) => {
		try {
			const res = await fetch(
				`${import.meta.env.VITE_SERVER_URL}/boards`,
				{
					method: 'GET',
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				}
			);
			const boards = await res.json();
			setBoards(boards);
		} catch (err: any) {
			console.log(err.message);
			if (
				['Unauthorized access!', 'Invalid JWT token!'].includes(
					err.message
				)
			) {
				navigate('/');
			}
		}
	};

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
			boards,
			userData,
			workspaces,
			isCreateBoardModalOpen,
			isEditProfileModalOpen,
			isCreateWorkspaceModalOpen,
		},
		operations: {
			logout,
			goToBoard,
			toggleEditProfileModal,
			toggleCreateBoardModal,
			toggleCreateWorkspaceModal,
		},
	};
};
