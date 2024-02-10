import styles from './entryModificationButton.module.css';

interface IEntryModificationProps {
	onClick?(): void;
	children: React.ReactNode;
}

export const EntryModificationButton = ({
	onClick,
	children
}: IEntryModificationProps) => {
	return (
		<button onClick={onClick} className={styles.button}>
			{children}
		</button>
	);
};
