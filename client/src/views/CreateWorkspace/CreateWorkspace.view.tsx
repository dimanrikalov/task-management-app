import { RxCross2 } from 'react-icons/rx';
import { Input } from '@/components/Input/Input';
import styles from './createWorkspace.module.css';
import { Button } from '@/components/Button/Button';
import { ErrorMessage } from '@/components/ErrorMessage/ErrorMessage';
import { useCreateWorkspaceViewModel } from './CreateWorkspace.viewmodel';
import { AddColleagueInput } from '@/components/AddColleagueInput/AddColleagueInput';

interface ICreateWorkspaceView {
	closeBtnHandler(): void;
}

export const CreateWorkspaceView = ({
	closeBtnHandler,
}: ICreateWorkspaceView) => {
	const { state, operations } = useCreateWorkspaceViewModel();

	return (
		<div className={styles.background}>
			<RxCross2 className={styles.closeBtn} onClick={closeBtnHandler} />
			<div className={styles.leftSide}>
				<div className={styles.introMessage}>
					<h1>Let's create a workspace!</h1>
					<p>
						Boost your productivity by making it easier for everyone
						to access multiple{' '}
						<span className={styles.bold}>boards</span> in one
						location.
					</p>
				</div>

				<div className={styles.inputContainer}>
					<h2>
						STEP 1: Name your <span>workspace</span>
					</h2>
					<form className={styles.createForm}>
						<ErrorMessage
							message="Workspace name is taken!"
							fontSize={18}
						/>
						<Input
							type="text"
							name="workspace-name"
							value={state.inputValue}
							placeholder="Enter a workspace name"
							onChange={operations.handleInputChange}
							fontSize={18}
						/>
						<Button
							message="Create Workspace"
							invert={true}
							fontSize={18}
						/>
					</form>
				</div>
			</div>
			<div className={styles.rightSide}>
				<AddColleagueInput title={'Workspace users list'} />
			</div>
		</div>
	);
};
