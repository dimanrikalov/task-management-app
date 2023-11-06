import styles from './app.module.css';
import { HomeView } from './views/HomeView/Home.view';
import { IntroView } from './views/IntroView/Intro.view';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
	return (
		<div className={styles.background}>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<IntroView />} />
					<Route path="/dashboard" element={<HomeView />} />
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default App;
