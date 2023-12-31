import { Router } from './router';
import { store } from './app/store';
import styles from './app.module.css';
import { Provider } from 'react-redux';
import { Notification } from './components/Notification/Notification';
import { ErrorNotification } from './components/ErrorNotification/ErrorNotification';

function App() {
	return (
		<div className={styles.background}>
			<Provider store={store}>
				<Router />
				<Notification />
				<ErrorNotification />
			</Provider>
		</div>
	);
}

export default App;
