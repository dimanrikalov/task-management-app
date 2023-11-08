import { RxCross2 } from 'react-icons/rx';
import styles from './createBoard.module.css';
import { Input } from '@/components/Input/Input';
import { Button } from '@/components/Button/Button';
import { ErrorMessage } from '@/components/ErrorMessage/ErrorMessage';
import { AddColleagueInput } from '@/components/AddColleagueInput/AddColleagueInput';
import { useCreateWorkspaceViewModel } from '@/views/CreateWorkspace/CreateWorkspace.viewmodel';

interface ICreateBoardView {
	closeBtnHandler(): void;
}

export const CreateBoardView = ({ closeBtnHandler }: ICreateBoardView) => {
	const { state, operations } = useCreateWorkspaceViewModel();

	return (
		<div className={styles.background}>
			<RxCross2 className={styles.closeBtn} onClick={closeBtnHandler} />
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
						STEP 1: Name your <span>board</span>
					</h2>
					<form className={styles.createForm}>
						<ErrorMessage
							message="Board name is taken!"
							fontSize={18}
						/>
						<Input
							type="text"
							name="board-name"
							value={state.inputValue}
							placeholder="Enter a board name"
							onChange={operations.handleInputChange}
							fontSize={18}
						/>
					</form>
				</div>

				<div className={styles.inputContainer}>
					<h2>STEP 2: Choose a workspace</h2>
					<form className={styles.createForm}>
						<Input
							type="text"
							name="workspace-name"
							value={state.inputValue}
							placeholder="Enter a board name"
							onChange={operations.handleInputChange}
							fontSize={18}
						/>
						<Button
							message="Create Board"
							invert={true}
							fontSize={18}
						/>
					</form>
				</div>
			</div>
			<div className={styles.rightSide}>
				<AddColleagueInput title={'Board users list'}/>
			</div>
		</div>
	);
};
