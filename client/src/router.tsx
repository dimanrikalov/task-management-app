import { AuthGuard } from './guards/authGuard';
import { UnAuthGuard } from './guards/unAuthGuard';
import { HomeView } from './views/HomeView/Home.view';
import { BoardView } from './views/BoardView/BoardView';
import { IntroView } from './views/IntroView/Intro.view';
import { SignUpView } from './views/SignUpView/SignUp.view';
import { SignInView } from './views/SignInView/SignIn.view';
import { ErrorView } from './components/ErrorView/Error.view';
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
		],
		errorElement: <ErrorView path={'/'} />
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
				),
				errorElement: <ErrorView path={'/dashboard'} />
			},
			{
				path: '/boards/:id',
				element: (
					<BoardContextProvider>
						<BoardView />
					</BoardContextProvider>
				),
				errorElement: <ErrorView path={'/dashboard'} />
			},
			{
				path: '/workspaces/:id',
				element: (
					<WorkspaceContextProvider>
						<WorkspaceView />
					</WorkspaceContextProvider>
				),
				errorElement: <ErrorView path={'/dashboard'} />
			}
		]
	},
	{
		path: '/#/*',
		element: <ErrorView path={'/dashboard'} />
	}
]);

export const Router = () => <RouterProvider router={router} />;
