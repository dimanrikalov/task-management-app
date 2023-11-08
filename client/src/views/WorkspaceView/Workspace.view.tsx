import styles from './workspace.module.css';
import { LuUserCog } from 'react-icons/lu';
import { Input } from '@/components/Input/Input';
import { RiDeleteBin2Line } from 'react-icons/ri';
import { Button } from '@/components/Button/Button';
import { BoardCard } from '@/components/BoardCard/BoardCard';
import { useWorkspaceViewModel } from './Workspace.viewmodel';
import { BackButton } from '@/components/BackButton/BackButton';

export const WorkspaceView = () => {
	const { state, operations } = useWorkspaceViewModel();

	return (
		<div className={styles.background}>
			<div className={styles.header}>
				<div className={styles.left}>
					<BackButton onClick={operations.backBtnHandler} />
					<h2>My class workspace</h2>
				</div>
				<div className={styles.right}>
					<Button
						icon={<LuUserCog className={styles.icon} />}
						message={'Edit Users'}
						onClick={() => {}}
						invert={true}
					/>
					<Button
						icon={<RiDeleteBin2Line className={styles.icon} />}
						message={'Delete Workspace'}
						invert={true}
					/>
				</div>
			</div>
			<div className={styles.titleContainer}>
				<h1 className={styles.title}>Boards</h1>
				<div className={styles.inputContainer}>
					<Input
						type="text"
						name="board-name-input"
						value={state.inputValue}
						placeholder="Search by board name"
						onChange={operations.inputChangeHandler}
					/>
				</div>
			</div>
			<div className={styles.boardsContainer}>
				<button className={styles.addButton}>
					Add Board to "My class workspace"
				</button>
				<BoardCard onClickHandler={() => {}} boardName="Board Name" />
				<BoardCard onClickHandler={() => {}} boardName="Board Name" />
				<BoardCard onClickHandler={() => {}} boardName="Board Name" />
				<BoardCard onClickHandler={() => {}} boardName="Board Name" />
				<BoardCard onClickHandler={() => {}} boardName="Board Name" />
				<BoardCard onClickHandler={() => {}} boardName="Board Name" />
				<BoardCard onClickHandler={() => {}} boardName="Board Name" />
				<BoardCard onClickHandler={() => {}} boardName="Board Name" />
				<BoardCard onClickHandler={() => {}} boardName="Board Name" />
				<BoardCard onClickHandler={() => {}} boardName="Board Name" />
				<BoardCard onClickHandler={() => {}} boardName="Board Name" />
				<BoardCard onClickHandler={() => {}} boardName="Board Name" />
				<BoardCard onClickHandler={() => {}} boardName="Board Name" />
				<BoardCard onClickHandler={() => {}} boardName="Board Name" />
				<BoardCard onClickHandler={() => {}} boardName="Board Name" />
				<BoardCard onClickHandler={() => {}} boardName="Board Name" />
				<BoardCard onClickHandler={() => {}} boardName="Board Name" />
				<BoardCard onClickHandler={() => {}} boardName="Board Name" />
				<BoardCard onClickHandler={() => {}} boardName="Board Name" />
				<BoardCard onClickHandler={() => {}} boardName="Board Name" />
				<BoardCard onClickHandler={() => {}} boardName="Board Name" />
				<BoardCard onClickHandler={() => {}} boardName="Board Name" />
				<BoardCard onClickHandler={() => {}} boardName="Board Name" />
				<BoardCard onClickHandler={() => {}} boardName="Board Name" />
			</div>
		</div>
	);
};
