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
	closeBtnHandler(): void;
}

export const CreateBoardView = ({ closeBtnHandler }: ICreateBoardView) => {
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
						<h2>Choose a workspace</h2>
						<form className={styles.createForm} >
							<div className={styles.errorMessageContainer}>
								{
									state.errorMessage &&
									<ErrorMessage
										fontSize={16}
										message={state.errorMessage}
									/>
								}
							</div>
							<WorkspaceInput
								onChange={operations.handleInputChange}
								value={state.inputValues.workspaceName}
								accessibleWorkspaces={state.workspacesData}
								chooseWorkspace={operations.selectWorkspace}
							/>
						</form>
					</div>

					<div className={styles.inputContainer}>
						<h2>
							Name your <span>board</span>
						</h2>
						<form
							className={styles.createForm}
							onSubmit={operations.createBoard}
						>
							<IntroInput
								type="text"
								name="boardName"
								placeholder="Enter a board name"
								value={state.inputValues.boardName}
								onChange={operations.handleInputChange}
							/>
							<IntroButton
								message="Create Board"
							/>
						</form>
					</div>

				</div>

				<div className={styles.rightSide}>
					<div className={classNames(
						styles.rightSideContent,
						(
							(
								!state.selectedWorkspace ||
								state.selectedWorkspace.name.toLowerCase().trim() === 'personal workspace'
							)
						) && styles.hidden
					)}>
						{
							<AddColleagueInput
								title={'Board users list'}
								addColleagueHandler={operations.addBoardColleague}
								colleagues={state.selectedWorkspace?.workspaceUsers}
								removeColleagueHandler={operations.removeBoardColleague}
							/>
						}
					</div>
				</div>


			</div>
		</div>
	);
};
