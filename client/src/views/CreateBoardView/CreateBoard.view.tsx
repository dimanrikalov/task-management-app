import classNames from 'classnames';
import { RxCross2 } from 'react-icons/rx';
import styles from './createBoard.module.css';
import { ErrorMessage } from '@/components/ErrorMessage/ErrorMessage';
import { IntroInput } from '@/components/Inputs/IntroInput/IntroInput';
import { IntroButton } from '@/components/Buttons/IntroButton/IntroButton';
import { WorkspaceInput } from '@/components/WorkspaceInput/WorkspaceInput';
import { AddColleagueInput } from '@/components/AddColleagueInput/AddColleagueInput';
import { IDetailedWorkspace, useCreateBoardViewModel } from './CreateBoard.viewmodel';

interface ICreateBoardView {
	workspaceData?: IDetailedWorkspace;
	closeBtnHandler(): void;
}

export const CreateBoardView = ({ workspaceData, closeBtnHandler, colleagueIds }: ICreateBoardView) => {
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
						<form className={styles.createForm} onSubmit={operations.createBoard}>
							<WorkspaceInput
								onChange={operations.handleInputChange}
								chooseWorkspace={operations.chooseWorkspace}
								accessibleWorkspaces={state.accessibleWorkspaces}
								value={workspaceData?.name || state.inputFields.workspaceName}
							/>

							<IntroButton
								message="Create Board"
								disabled={!state.workspaceDetailedData && !workspaceData}
							/>
						</form>
					</div>
				</div>
				<div className={styles.rightSide}>
					<div className={classNames(
						styles.rightSideContent,
						((!workspaceData || workspaceData.name.toLowerCase().trim() === 'personal workspace') && (!state.workspaceDetailedData ||
							state.workspaceDetailedData.name.toLowerCase().trim() === 'personal workspace')) && styles.hidden
					)}>
						{
							<AddColleagueInput
								boardMode={true}
								title={'Board users list'}
								colleagueIds={state.colleagueIds}
								disableDeletionFor={state.disableDeletionFor}
								selectedWorkspace={state.workspaceDetailedData}
								addColleagueHandler={operations.addWorkspaceColleague}
								removeColleagueHandler={operations.removeWorkspaceColleague}
							/>
						}
					</div>
				</div>
			</div>
		</div>
	);
};
