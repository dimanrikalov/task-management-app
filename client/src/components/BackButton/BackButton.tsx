import classNames from 'classnames';
import styles from './backButton.module.css';
import { FaChevronLeft } from 'react-icons/fa';

interface IBackButtonProps {
	onClick(): void;
	iconSize?: number;
	reverse?: boolean;
}

export const BackButton = ({
	onClick,
	iconSize = 18,
	reverse = false,
}: IBackButtonProps) => {
	return (
		<button
			className={classNames(styles.backBtn, reverse && styles.reverse)}
			onClick={onClick}
		>
			<FaChevronLeft size={iconSize} />
		</button>
	);
};
