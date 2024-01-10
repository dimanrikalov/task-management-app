import styles from './modal.module.css';

interface IModalProps {
	children: React.ReactNode;
}

export const Modal = ({ children }: IModalProps) => {
	return <div className={styles.background}>{children}</div>;
};
