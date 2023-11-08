import styles from './app.module.css';
import { HomeView } from './views/HomeView/Home.view';
import { IntroView } from './views/IntroView/Intro.view';
import { SignInView } from './views/SignInView/SignIn.view';
import { SignUpView } from './views/SignUpView/SignUp.view';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { WorkspaceView } from './views/WorkspaceView/Workspace.view';

function App() {
	return (
		<div className={styles.background}>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<IntroView />} />
					<Route path="/dashboard" element={<HomeView />} />
					<Route path="/auth/sign-up" element={<SignUpView />} />
					<Route path="/auth/sign-in" element={<SignInView />} />
					<Route path="/workspace" element={<WorkspaceView />} />
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default App;
