import { useEffect, useState } from 'react';
import { ITaskProps } from '@/components/Task/Task';
import { useLocation, useNavigate } from 'react-router-dom';
import { ViewModelReturnType } from '@/interfaces/viewModel.interface';
import { extractTokens, isAccessTokenValid, refreshTokens } from '@/utils';

interface IColumn {
	id: number;
	name: string;
	position: number;
	boardId: number;
	tasks: ITaskProps[];
}

export interface IMessage {
	id: number;
	content: string;
	writtenBy: number;
}

interface IBoardData {
	id: number;
	name: string;
	workspaceId: number;
	columns: IColumn[];
	messages: IMessage[];
	boardUserIds: number[];
}

interface IBoardViewModelState {
	isChatOpen: boolean;
	boardData: IBoardData | null;
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
	addBoardColleague(colleagueId: number): void;
	removeWorkspaceColleague(colleagueId: number): void;
}

export const useBoardViewModel = (): ViewModelReturnType<
	IBoardViewModelState,
	IBoardViewModelOperations
> => {
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const boardId = pathname.split('/').pop();
	const [isChatOpen, setIsChatOpen] = useState(false);
	const [isEditBoardUsersModalOpen, setIsEditBoardUsersModalOpen] =
		useState(false);
	const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
	const [isDeleteBoardModalOpen, setIsDeleteBoardModalOpen] = useState(false);
	const [boardData, setBoardData] = useState<IBoardData | null>(null);
	const [refreshBoard, setRefreshBoard] = useState<boolean>(true);
	const { accessToken } = extractTokens();

	if (!isAccessTokenValid(accessToken)) {
		refreshTokens();
	}

	useEffect(() => {
		if (refreshBoard) {
			fetch(
				`${import.meta.env.VITE_SERVER_URL}/boards/${boardId}/details`,
				{
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${accessToken}`,
					},
					credentials: 'include', // Include credentials (cookies) in the request
				}
			)
				.then((res) => res.json())
				.then((data) => {
					console.log(data);
					setBoardData(data);
					setRefreshBoard(false);
				});
		}
	}, []);

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

	const addBoardColleague = async (colleagueId: number) => {
		if (!boardData) {
			console.log('No workspace data!');
			return;
		}

		try {
			await fetch(
				`${import.meta.env.VITE_SERVER_URL}/boards/${
					boardData.id
				}/colleagues`,
				{
					method: 'POST',
					headers: {
						Authorization: `Bearer ${accessToken}`,
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						colleagueId,
					}),
				}
			);

			// Set refreshWorkspace to true to trigger a re-fetch of the workspace details
			setRefreshBoard(true);
		} catch (err: any) {
			console.log(err.message);
		}
	};

	const removeWorkspaceColleague = async (colleagueId: number) => {
		if (!boardData) {
			console.log('No workspace data!');
			return;
		}
		try {
			await fetch(
				`${import.meta.env.VITE_SERVER_URL}/boards/${
					boardData.id
				}/colleagues`,
				{
					method: 'DELETE',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${accessToken}`,
					},
					body: JSON.stringify({
						colleagueId,
					}),
				}
			);

			setRefreshBoard(true);
		} catch (err: any) {
			console.log(err.message);
		}
	};

	return {
		state: {
			boardData,
			isChatOpen,
			isCreateTaskModalOpen,
			isDeleteBoardModalOpen,
			isEditBoardUsersModalOpen,
		},
		operations: {
			goBack,
			toggleIsChatOpen,
			addBoardColleague,
			removeWorkspaceColleague,
			toggleIsCreateTaskModalOpen,
			toggleIsDeleteBoardModalOpen,
			toggleIsEditBoardUsersModalOpen,
		},
	};
};
