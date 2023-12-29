import { AuthGuard } from './guards/authGuard';
import { UnAuthGuard } from './guards/unAuthGuard';
import { HomeView } from './views/HomeView/Home.view';
import { BoardView } from './views/BoardView/BoardView';
import { IntroView } from './views/IntroView/Intro.view';
import { SignUpView } from './views/SignUpView/SignUp.view';
import { SignInView } from './views/SignInView/SignIn.view';
import { RouterProvider, createHashRouter } from 'react-router-dom';
import { WorkspaceView } from './views/WorkspaceView/Workspace.view';

export const ROUTES = {
	HOME: '/',
	DASHBOARD: '/dashboard',
	SIGN_IN: '/auth/sign-in',
	SIGN_UP: '/auth/sign-up',
	BOARD: (boardId: number) => `/boards/${boardId}`,
	WORKSPACE: (workspaceId: number) => `/workspaces/${workspaceId}`
}

const router = createHashRouter([
	{
		path: '/',
		element: <UnAuthGuard />,
		children: [
			{ path: '/', element: <IntroView /> },
			{ path: '/auth/sign-up', element: <SignUpView /> },
			{ path: '/auth/sign-in', element: <SignInView /> },
		]
	},
	{
		path: '/',
		element: <AuthGuard />,
		children: [
			{ path: '/dashboard', element: <HomeView /> },
			{ path: '/boards/:id', element: <BoardView /> },
			{ path: '/workspaces/:id', element: <WorkspaceView /> },
		]
	}
]);

export const Router = () => <RouterProvider router={router} />;
