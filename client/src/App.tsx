import { Router } from './router';
import styles from './app.module.css';
import { useTranslate } from './hooks/useTranslate';
import { UserContextProvider } from './contexts/user.context';
import { ErrorContextProvider } from './contexts/error.context';
import { ModalsContextProvider } from './contexts/modals.context';
import { Notification } from './components/Notification/Notification';
import { TranslationContextProvider } from './contexts/translation.context';
import { NotificationContextProvider } from './contexts/notification.context';
import { SocketConnectionProvider } from './contexts/socketConnection.context';
import { ErrorNotification } from './components/ErrorNotification/ErrorNotification';
import { SelectedWorkspaceContextProvider } from './contexts/selectedWorkspace.context';

function App() {
	const { t } = useTranslate();
	return (
		<div className={styles.background}>
			<TranslationContextProvider
				translationsProvider={{ t: (key: string) => t(key) }}
			>
				<ErrorContextProvider>
					<UserContextProvider>
						<SocketConnectionProvider>
							<NotificationContextProvider>
								<ModalsContextProvider>
									<SelectedWorkspaceContextProvider>
										<Router />
									</SelectedWorkspaceContextProvider>
								</ModalsContextProvider>
								<Notification />
							</NotificationContextProvider>
							<ErrorNotification />
						</SocketConnectionProvider>
					</UserContextProvider>
				</ErrorContextProvider>
			</TranslationContextProvider>
		</div>
	);
}

export default App;
