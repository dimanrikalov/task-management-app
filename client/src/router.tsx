import App from './App';
import { IntroView } from './views/IntroView/Intro.view';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

const router = createBrowserRouter([
	{
		path: '/',
		element: <App />,
	},
	{
		path: '/intro',
		element: <IntroView />,
	},
]);

export const Router = () => <RouterProvider router={router} />;
