export enum METHODS {
	GET = 'GET',
	PUT = 'PUT',
	POST = 'POST',
	DELETE = 'DELETE'
}

const BASE_URL = import.meta.env.VITE_SERVER_URL as string;

export const TASK_ENDPOINTS = {
	BASE: `${BASE_URL}/tasks`,
	MOVE: `${BASE_URL}/tasks/move`,
	EDIT: (taskId: number) => `${BASE_URL}/tasks/${taskId}`,
	COMPLETE: (taskId: number) => `${BASE_URL}/tasks/${taskId}/complete`,
	UPLOAD_IMG: (taskId: number) => `${BASE_URL}/tasks/${taskId}/upload-image`
};

export const NOTIFICATIONS_ENDPOINTS = {
	BASE: `${BASE_URL}/notifications`,
	EDIT: (notificationId: number) =>
		`${BASE_URL}/notifications/${notificationId}`
};

export const STEP_ENDPOINTS = {
	BASE: `${BASE_URL}/steps`
};

export const COLUMN_ENDPOINTS = {
	BASE: `${BASE_URL}/columns`,
	MOVE: `${BASE_URL}/columns/move`,
	EDIT: (columnId: number) => `${BASE_URL}/columns/${columnId}`,
	RENAME: (columnId: number) => `${BASE_URL}/columns/${columnId}/rename`
};

export const USER_ENDPOINTS = {
	USER: `${BASE_URL}/user`,
	BASE: `${BASE_URL}/users`,
	EDIT: `${BASE_URL}/users/edit`,
	STATS: `${BASE_URL}/users/stats`,
	DELETE: `${BASE_URL}/users/delete`,
	SIGN_IN: `${BASE_URL}/users/sign-in`,
	SIGN_UP: `${BASE_URL}/users/sign-up`,
	REFRESH: `${BASE_URL}/users/refresh`,
	PROFILE_IMG_EDIT: `${BASE_URL}/users/edit/profile-img`
};

export const WORKSPACE_ENDPOINTS = {
	BASE: `${BASE_URL}/workspaces`,
	RENAME: (workspaceId: number) =>
		`${BASE_URL}/workspaces/${workspaceId}/rename`,
	DETAILS: (workspaceId: number) =>
		`${BASE_URL}/workspaces/${workspaceId}/details`,
	COLLEAGUES: (workspaceId: number) =>
		`${BASE_URL}/workspaces/${workspaceId}/colleagues`,
	WORKSPACE: (workspaceId: number) => `${BASE_URL}/workspaces/${workspaceId}`
};

export const MESSAGE_ENDPOINTS = {
	BASE: (boardId: number) => `${BASE_URL}/boards/${boardId}/messages`
};

export const BOARD_ENDPOINTS = {
	BASE: `${BASE_URL}/boards`,
	BOARD: (boardId: number) => `${BASE_URL}/boards/${boardId}`,
	RENAME: (boardId: number) => `${BASE_URL}/boards/${boardId}/rename`,
	DETAILS: (boardId: number) => `${BASE_URL}/boards/${boardId}/details`,
	COLLEAGUES: (boardId: number) => `${BASE_URL}/boards/${boardId}/colleagues`
};

interface IRequestParams {
	body?: FormData | object;
	method?: METHODS;
	endpoint: string;
	accessToken?: string;
}

export const request = async ({
	body,
	method,
	endpoint,
	accessToken
}: IRequestParams) => {
	const headers = new Headers();
	headers.set('Authorization', `Bearer ${accessToken}`);

	const request: RequestInit = {
		headers,
		// credentials: 'include',
		method: method || METHODS.GET
	};

	if (body) {
		if (body instanceof FormData) {
			request.body = body;
		} else {
			request.body = JSON.stringify(body);
			headers.set('Content-Type', 'application/json');
		}
	}

	const res = await fetch(endpoint, request);

	const data = await res.json();

	//case where the request fails on Dto level
	if (data.statusCode === 400) {
		throw new Error(data.message[0]);
	}

	return data;
};
