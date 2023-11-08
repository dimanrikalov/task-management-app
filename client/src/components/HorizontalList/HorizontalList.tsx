import { useState } from 'react';
import { Input } from '../Input/Input';
import styles from './horizontalList.module.css';

interface IHorizontalListProps {
	title: string;
	showSearchInput?: boolean;
	children: React.ReactNode[];
}

export const HorizontalList = ({
	title,
	showSearchInput = true,
	children,
}: IHorizontalListProps) => {
	const [inputValue, setInputValue] = useState('');

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value);
	};

	return (
		<div className={styles.homeList}>
			<div className={styles.header}>
				<h3 className={styles.title}>{title}</h3>
				{showSearchInput && (
					<div className={styles.inputContainer}>
						<Input
							type="text"
							name="search"
							value={inputValue}
							onChange={handleInputChange}
							placeholder="Search by name"
						/>
					</div>
				)}
			</div>
			<div className={styles.horizontalList}>{children}</div>
		</div>
	);
};
