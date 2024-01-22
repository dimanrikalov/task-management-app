import { AuthGuard } from './guards/authGuard';
import { UnAuthGuard } from './guards/unAuthGuard';
import { HomeView } from './views/HomeView/Home.view';
import { BoardView } from './views/BoardView/BoardView';
import { IntroView } from './views/IntroView/Intro.view';
import { SignUpView } from './views/SignUpView/SignUp.view';
import { SignInView } from './views/SignInView/SignIn.view';
import { BoardContextProvider } from './contexts/board.context';
import { RouterProvider, createHashRouter } from 'react-router-dom';
import { WorkspaceView } from './views/WorkspaceView/Workspace.view';
import { WorkspaceContextProvider } from './contexts/workspace.context';
import { UserStatsContextProvider } from './contexts/userStats.context';

export const ROUTES = {
	HOME: '/',
	DASHBOARD: '/dashboard',
	SIGN_IN: '/auth/sign-in',
	SIGN_UP: '/auth/sign-up',
	BOARD: (boardId: number) => `/boards/${boardId}`,
	WORKSPACE: (workspaceId: number) => `/workspaces/${workspaceId}`
};

const router = createHashRouter([
	{
		path: '/',
		element: <UnAuthGuard />,
		children: [
			{ path: '/', element: <IntroView /> },
			{ path: '/auth/sign-up', element: <SignUpView /> },
			{ path: '/auth/sign-in', element: <SignInView /> }
		]
	},
	{
		path: '/',
		element: <AuthGuard />,
		children: [
			{
				path: '/dashboard',
				element: (
					<UserStatsContextProvider>
						<HomeView />
					</UserStatsContextProvider>
				)
			},
			{
				path: '/boards/:id',
				element: (
					<BoardContextProvider>
						<BoardView />
					</BoardContextProvider>
				)
			},
			{
				path: '/workspaces/:id',
				element: (
					<WorkspaceContextProvider>
						<WorkspaceView />
					</WorkspaceContextProvider>
				)
			}
		]
	}
]);

export const Router = () => <RouterProvider router={router} />;
