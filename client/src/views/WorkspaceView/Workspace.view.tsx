import styles from './workspace.module.css';
import { LuUserCog } from 'react-icons/lu';
import { TiDocumentAdd } from 'react-icons/ti';
import { Input } from '@/components/Input/Input';
import { RiDeleteBin2Line } from 'react-icons/ri';
import { Button } from '@/components/Button/Button';
import { BoardCard } from '@/components/BoardCard/BoardCard';
import { useWorkspaceViewModel } from './Workspace.viewmodel';
import { BackButton } from '@/components/BackButton/BackButton';

export const COLORS = [
	'#FF6B6B',
	'#FFD700',
	'#FFA07A',
	'#FF8C00',
	'#FF69B4',
	'#FF4500',
	'#FF6347',
	'#FFD700',
	'#32CD32',
	'#00FF7F',
	'#00FFFF',
	'#1E90FF',
	'#FF1493',
	'#FF69B4',
	'#FFD700',
	'#FF4500',
	'#FF8C00',
	'#32CD32',
	'#00FF7F',
	'#1E90FF',
];

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
						fontSize={18}
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
					<TiDocumentAdd className={styles.icon} />
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
