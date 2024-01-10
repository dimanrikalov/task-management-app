import styles from './boardCard.module.css';

interface IBoardCardProps {
	fontSize?: number;
	boardName: string;
	onClickHandler(): void;
}

export const BoardCard = ({
	fontSize,
	boardName,
	onClickHandler
}: IBoardCardProps) => {
	return (
		<button
			style={{ fontSize: fontSize ? fontSize : 24 }}
			className={styles.background}
			onClick={onClickHandler}
		>
			{boardName}
		</button>
	);
};
