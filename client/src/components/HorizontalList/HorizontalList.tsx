import { useState } from 'react';
import { Input } from '../Input/Input';
import { HomeCard } from '../HomeCard/HomeCard';
import styles from './horizontalList.module.css';

interface IHorizontalListProps {
	title: string;
	showSearchInput?: boolean;
}

export const HorizontalList = ({
	title,
	showSearchInput = true,
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
			<div className={styles.horizontalList}>
				<HomeCard
					onClick={() => {}}
					title="Board Name"
					subtitle="Workspace Name"
					userCount={16}
				/>
				<HomeCard
					onClick={() => {}}
					title="Board Name"
					subtitle="Workspace Name"
					userCount={16}
				/>
				<HomeCard
					onClick={() => {}}
					title="Board Name"
					subtitle="Workspace Name"
					userCount={16}
				/>
				<HomeCard
					onClick={() => {}}
					title="Board Name"
					subtitle="Workspace Name"
					userCount={16}
				/>
				<HomeCard
					onClick={() => {}}
					title="Board Name"
					subtitle="Workspace Name"
					userCount={16}
				/>{' '}
				<HomeCard
					onClick={() => {}}
					title="Board Name"
					subtitle="Workspace Name"
					userCount={16}
				/>
				<HomeCard
					onClick={() => {}}
					title="Board Name"
					subtitle="Workspace Name"
					userCount={16}
				/>
				<HomeCard
					onClick={() => {}}
					title="Board Name"
					subtitle="Workspace Name"
					userCount={16}
				/>
			</div>
		</div>
	);
};
