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
			onClick={onClickHandler}
			className={styles.background}
			style={{ fontSize: fontSize ? fontSize : 24 }}
		>
			{boardName}
		</button>
	);
};
