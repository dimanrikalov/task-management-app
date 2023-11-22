import { RxCross2 } from 'react-icons/rx';
import styles from './createWorkspace.module.css';
import { ErrorMessage } from '@/components/ErrorMessage/ErrorMessage';
import { IntroInput } from '@/components/Inputs/IntroInput/IntroInput';
import { useCreateWorkspaceViewModel } from './CreateWorkspace.viewmodel';
import { IntroButton } from '@/components/Buttons/IntroButton/IntroButton';
import { AddColleagueInput } from '@/components/AddColleagueInput/AddColleagueInput';

interface ICreateWorkspaceView {
	closeBtnHandler(): void;
}

export const CreateWorkspaceView = ({
	closeBtnHandler,
}: ICreateWorkspaceView) => {
	const { state, operations } = useCreateWorkspaceViewModel();

	return (
		<div className={styles.backgroundWrapper}>
			<div className={styles.background}>
				<RxCross2 className={styles.closeBtn} onClick={closeBtnHandler} />
				<div className={styles.leftSide}>
					<div className={styles.introMessage}>
						<h1>Let's create a workspace!</h1>
						<p>
							Boost your productivity by making it easier for everyone
							to access multiple{' '}
							<span className={styles.bold}>boards</span> in <span className={styles.bold}>one</span> shared space.
						</p>
					</div>

					<div className={styles.inputContainer}>
						<h2>
							Name your <span>workspace</span>
						</h2>
						<form className={styles.createForm}>
							<ErrorMessage
								message="Workspace name is taken!"
								fontSize={16}
							/>
							<IntroInput
								type="text"
								name="workspace-name"
								value={state.inputValue}
								placeholder="Enter a workspace name"
								onChange={operations.handleInputChange}
							/>
							<IntroButton
								onClick={operations.goToWorkspace}
								message="Create Workspace"
							/>
						</form>
					</div>
				</div>
				<div className={styles.rightSide}>
					<AddColleagueInput title={'Workspace users list'} />
				</div>
			</div>
		</div>
	);
};
