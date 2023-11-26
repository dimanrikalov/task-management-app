import classNames from 'classnames';
import { RxCross2 } from 'react-icons/rx';
import styles from './createBoard.module.css';
import { useCreateBoardViewModel } from './CreateBoard.viewmodel';
import { ErrorMessage } from '@/components/ErrorMessage/ErrorMessage';
import { IntroInput } from '@/components/Inputs/IntroInput/IntroInput';
import { IntroButton } from '@/components/Buttons/IntroButton/IntroButton';
import { WorkspaceInput } from '@/components/WorkspaceInput/WorkspaceInput';
import { AddColleagueInput } from '@/components/AddColleagueInput/AddColleagueInput';

interface ICreateBoardView {
	workspaceName?: string;
	closeBtnHandler(): void;
}

export const CreateBoardView = ({ workspaceName, closeBtnHandler }: ICreateBoardView) => {
	const { state, operations } = useCreateBoardViewModel();

	return (
		<div className={styles.backgroundWrapper}>
			<RxCross2 className={styles.closeBtn} onClick={closeBtnHandler} />
			<div className={styles.background}>
				<div className={styles.leftSide}>
					<div className={styles.introMessage}>
						<h1>Let's create a board!</h1>
						<p>
							A <span className={styles.bold}>board</span> is the
							secret to enhanced productivity and organization. It
							offers visual clarity and empowers you to stay on top of
							priorities and efficiently distribute workload between
							employees.
						</p>
					</div>

					<div className={styles.inputContainer}>
						<h2>
							Name your <span>board</span>
						</h2>
						<form className={styles.createForm}>
							<div className={styles.errorMessageContainer}>
								{
									state.errorMessage &&
									<ErrorMessage
										fontSize={16}
										message={state.errorMessage}
									/>
								}
							</div>
							<IntroInput
								type="text"
								name="boardName"
								value={state.inputFields.boardName}
								placeholder="Enter a board name"
								onChange={operations.handleInputChange}
							/>
						</form>
					</div>

					<div className={styles.inputContainer}>
						<h2>Choose a workspace</h2>
						<form className={styles.createForm}>
							<WorkspaceInput
								onChange={operations.handleInputChange}
								chooseWorkspace={operations.chooseWorkspace}
								accessibleWorkspaces={state.accessibleWorkspaces}
								value={workspaceName || state.inputFields.workspaceName}
							/>

							<IntroButton
								message="Create Board"
								onClick={operations.createBoard}
							/>
						</form>
					</div>
				</div>
				<div className={styles.rightSide}>
					<div className={classNames(styles.rightSideContent, !state.workspaceData && styles.hidden)}>
						<AddColleagueInput title={'Board users list'} />
					</div>
				</div>
			</div>
		</div>
	);
};
