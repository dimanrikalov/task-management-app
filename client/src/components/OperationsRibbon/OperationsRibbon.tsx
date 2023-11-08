import { MdLibraryAdd } from 'react-icons/md';
import { HiDocumentAdd } from 'react-icons/hi';
import styles from './operationsRibbon.module.css';
import { FaChevronLeft, FaUserEdit } from 'react-icons/fa';


export const OperationsRibbon = () => {
	return (
		<div className={styles.background}>
			<MdLibraryAdd size={24} className={styles.icon} />
			<HiDocumentAdd size={24} className={styles.icon} />
			<FaUserEdit size={24} className={styles.icon} />
			<FaChevronLeft size={24} className={styles.icon} />
		</div>
	);
};
