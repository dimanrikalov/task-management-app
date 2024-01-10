import { Router } from './router';
import styles from './app.module.css';
import { UserContextProvider } from './contexts/user.context';
import { ErrorContextProvider } from './contexts/error.context';
import { ModalsContextProvider } from './contexts/modals.context';
import { Notification } from './components/Notification/Notification';
import { NotificationContextProvider } from './contexts/notification.context';
import { ErrorNotification } from './components/ErrorNotification/ErrorNotification';
import { SelectedWorkspaceContextProvider } from './contexts/selectedWorkspace.context';

function App() {
	return (
		<div className={styles.background}>
			<UserContextProvider>
				<ErrorContextProvider>
					<NotificationContextProvider>
						<ModalsContextProvider>
							<SelectedWorkspaceContextProvider>
								<Router />
							</SelectedWorkspaceContextProvider>
						</ModalsContextProvider>
						<Notification />
					</NotificationContextProvider>
					<ErrorNotification />
				</ErrorContextProvider>
			</UserContextProvider>
		</div>
	);
}

export default App;
