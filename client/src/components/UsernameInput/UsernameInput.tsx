import { useEffect, useState } from 'react';
import styles from './usernameInput.module.css';
import { UserEntry } from '../UserEntry/UserEntry';
import { IntroInput } from '../IntroInput/IntroInput';
import { useTranslate } from '../../hooks/useTranslate';
import { IUser } from '../AddColleagueInput/AddColleagueInput';

interface IUsernameInputProps {
	matches: IUser[];
	isLoading: boolean;
	inputValue: string;
	taskModalMode?: boolean;
	addUser(colleague: IUser): void;
	onChange(e: React.ChangeEvent<HTMLInputElement>): void;
}

const enterColleagueName = 'components.inputs.enterColleagueName'


export const UsernameInput = ({
	addUser,
	matches,
	onChange,
	isLoading,
	inputValue,
	taskModalMode = false,
}: IUsernameInputProps) => {
	const { t } = useTranslate();
	const [showDropdown, setShowDropdown] = useState<boolean>(false);

	//delay the opening of the user dropdown a bit
	useEffect(() => {
		setTimeout(() => {
			setShowDropdown(true);
		}, 100)
	}, [taskModalMode]);

	return (
		<div className={styles.input}>
			<IntroInput
				type="text"
				name="username"
				value={inputValue}
				onChange={onChange}
				placeholder={t(enterColleagueName)}
			/>
			{inputValue && !isLoading && matches.length > 0 && showDropdown && (
				<div className={styles.dropdownWrapper}>
					<div className={styles.dropdown}>
						{matches.map((match) => (
							<UserEntry
								key={match.id}
								showBtn={false}
								isDropdown={true}
								username={match.username}
								addHandler={() => addUser(match)}
								profileImgPath={match.profileImagePath}
							/>
						))}
					</div>
				</div>
			)}
		</div>
	);
};
