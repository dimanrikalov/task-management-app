import { RxCross2 } from 'react-icons/rx';
import styles from './createBoard.module.css';
import { ErrorMessage } from '@/components/ErrorMessage/ErrorMessage';
import { IntroInput } from '@/components/Inputs/IntroInput/IntroInput';
import { IntroButton } from '@/components/Buttons/IntroButton/IntroButton';
import { AddColleagueInput } from '@/components/AddColleagueInput/AddColleagueInput';
import { useCreateWorkspaceViewModel } from '@/views/CreateWorkspaceView/CreateWorkspace.viewmodel';

interface ICreateBoardView {
	closeBtnHandler(): void;
}

export const CreateBoardView = ({ closeBtnHandler }: ICreateBoardView) => {
	const { state, operations } = useCreateWorkspaceViewModel();

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
							<ErrorMessage
								fontSize={16}
								message="Board name is taken!"
							/>
							<IntroInput
								type="text"
								name="board-name"
								value={state.inputValue}
								placeholder="Enter a board name"
								onChange={operations.handleInputChange}
							/>
						</form>
					</div>

					<div className={styles.inputContainer}>
						<h2>Choose a workspace</h2>
						<form className={styles.createForm}>
							<IntroInput
								type="text"
								name="workspace-name"
								value={state.inputValue}
								placeholder="Enter a workspace name"
								onChange={operations.handleInputChange}
							/>
							<IntroButton
								message="Create Board"
								onClick={operations.goToWorkspace}
							/>
						</form>
					</div>
				</div>
				<div className={styles.rightSide}>
					<AddColleagueInput title={'Board users list'} />
				</div>
			</div>
		</div>
	);
};
