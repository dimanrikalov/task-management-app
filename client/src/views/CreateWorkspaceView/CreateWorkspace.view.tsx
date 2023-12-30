import { RxCross2 } from 'react-icons/rx';
import { Modal } from '@/components/Modal/Modal';
import styles from './createWorkspace.module.css';
import { IntroInput } from '@/components/Inputs/IntroInput/IntroInput';
import { useCreateWorkspaceViewModel } from './CreateWorkspace.viewmodel';
import { IntroButton } from '@/components/Buttons/IntroButton/IntroButton';
import { AddColleagueInput } from '@/components/AddColleagueInput/AddColleagueInput';


export const CreateWorkspaceView = (
) => {
	const { state, operations } = useCreateWorkspaceViewModel();

	return (
		<Modal>
			<div className={styles.backgroundWrapper}>
				<div className={styles.background}>
					<RxCross2
						className={styles.closeBtn}
						onClick={operations.toggleIsCreateWorkspaceModalOpen}
					/>
					<div className={styles.leftSide}>
						<div className={styles.introMessage}>
							<h1>Let's create a workspace!</h1>
							<p>
								Boost your productivity by making it easier for everyone
								to access multiple{' '} <span className={styles.bold}>boards </span>
								in <span className={styles.bold}>one</span> shared space.
							</p>
						</div>

						<div className={styles.inputContainer}>
							<h2>
								Name your <span>workspace</span>
							</h2>
							<form className={styles.createForm} onSubmit={operations.createWorkspace}>
								<IntroInput
									type="text"
									name="workspace-name"
									value={state.inputValue}
									placeholder="Enter a workspace name"
									onChange={operations.handleInputChange}
								/>
								<IntroButton
									message="Create Workspace"
								/>
							</form>
						</div>
					</div>
					<div className={styles.rightSide}>
						<AddColleagueInput
							colleagues={state.colleagues}
							title={'Workspace users list'}
							disableDeletionFor={[state.userData.id]}
							addColleagueHandler={operations.addToColleaguesToAdd}
							removeColleagueHandler={operations.removeFromColleaguesToAdd}
						/>
					</div>
				</div>
			</div>
		</Modal>
	);
};
