import classNames from 'classnames';
import styles from './backButton.module.css';
import { FaChevronLeft } from 'react-icons/fa';

interface IBackButtonProps {
	onClick(): void;
	iconSize?: number;
	reverse?: boolean;
	style?: React.CSSProperties;
}

export const BackButton = ({
	onClick,
	style,
	iconSize = 18,
	reverse = false
}: IBackButtonProps) => {
	return (
		<button
			style={style}
			onClick={onClick}
			className={classNames(styles.backBtn, reverse && styles.reverse)}
		>
			<FaChevronLeft size={iconSize} />
		</button>
	);
};
