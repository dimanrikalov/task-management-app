import classNames from 'classnames';
import { FaUserEdit } from 'react-icons/fa';
import { MdLibraryAdd } from 'react-icons/md';
import { HiDocumentAdd } from 'react-icons/hi';
import styles from './operationsRibbon.module.css';
import { BackButton } from '../BackButton/BackButton';

interface IOperationsRibbonProps {
	isOpen: boolean;
	toggle(): void;
}

export const OperationsRibbon = ({
	isOpen,
	toggle,
}: IOperationsRibbonProps) => {
	return (
		<div
			className={classNames(styles.background, !isOpen && styles.hidden)}
		>
			<div
				className={classNames(
					styles.toggleBtn,
					!isOpen && styles.toggleBtnReverse
				)}
			>
				<BackButton reverse={true} onClick={toggle} iconSize={21}/>
			</div>
			<div className={styles.operations}>
				<MdLibraryAdd size={24} className={styles.icon} />
				<HiDocumentAdd size={24} className={styles.icon} />
				<FaUserEdit size={24} className={styles.icon} />
			</div>
		</div>
	);
};
