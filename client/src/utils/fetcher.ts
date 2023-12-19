const BASE_URL = import.meta.env.VITE_SERVER_URL as string;

export const TASK_ENDPOINTS = {
	BASE: `${BASE_URL}/tasks`,
	MOVE: `${BASE_URL}/tasks/move`,
};

export const STEP_ENDPOINTS = {
	BASE: `${BASE_URL}/steps`,
};

export const COLUMN_ENDPOINTS = {
	BASE: `${BASE_URL}/columns`,
	MOVE: `${BASE_URL}/columns/move`,
	RENAME: `${BASE_URL}/columns/rename`,
};

export const USER_ENDPOINTS = {
	BASE: `${BASE_URL}/users`,
	EDIT: `${BASE_URL}/users/edit`,
	STATS: `${BASE_URL}/users/stats`,
	DELETE: `${BASE_URL}/users/delete`,
	SIGN_IN: `${BASE_URL}/users/sign-in`,
	SIGN_UP: `${BASE_URL}/users/sign-up`,
	REFRESH: `${BASE_URL}/users/refresh`,
	PROFILE_IMG_EDIT: `${BASE_URL}/users/edit/profile-img`,
};

export const WORKSPACE_ENDPOINTS = {
	BASE: `${BASE_URL}/workspaces`,
	WORKSPACE: (workspaceId: string) => `${BASE_URL}/workspaces/${workspaceId}`,
	DETAILS: (workspaceId: string) =>
		`${BASE_URL}/workspaces/${workspaceId}/details`,
	COLLEAGUES: (workspaceId: string) =>
		`${BASE_URL}/workspaces/${workspaceId}/colleagues`,
};

export const MESSAGE_ENDPOINTS = {
	BASE: (boardId: string) => `${BASE_URL}/boards/${boardId}/messages`,
};

export const BOARD_ENDPOINTS = {
	BASE: `${BASE_URL}/boards`,
	BOARD: (boardId: string) => `${BASE_URL}/boards/${boardId}`,
	DETAILS: (boardId: string) => `${BASE_URL}/boards/${boardId}/details`,
	COLLEAGUES: (boardId: string) => `${BASE_URL}/boards/${boardId}/colleagues`,
};

export enum METHODS {
	GET = 'GET',
	PUT = 'PUT',
	POST = 'POST',
	DELETE = 'DELETE',
}

interface IFetcherProps {
	body?: object;
	method?: METHODS;
	endpoint: string;
	accessToken?: string;
}

export const request = async ({
	body,
	method,
	endpoint,
	accessToken,
}: IFetcherProps) => {
	const res = await fetch(endpoint, {
		credentials: 'include',
		body: JSON.stringify(body),
		method: method || METHODS.GET,
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${accessToken}`,
		},
	});

	return await res.json();
};
