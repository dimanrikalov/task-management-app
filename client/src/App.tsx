import { Router } from './router';
import styles from './app.module.css';
import { ErrorContextProvider } from './contexts/ErrorContext';
import { ErrorNotification } from './components/ErrorNotification/ErrorNotification';

function App() {
	return (
		<div className={styles.background}>
			<ErrorContextProvider>
				<Router />
				<ErrorNotification />
			</ErrorContextProvider>
		</div>
	);
}

export default App;
