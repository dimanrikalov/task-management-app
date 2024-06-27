import styles from './workspaceInput.module.css';
import { IntroInput } from '../IntroInput/IntroInput';
import { IWorkspace } from '../../hooks/useCreateBoardModal';

interface IWorkspaceInputProps {
	value: string;
	onLoad?(): any;
	disabled?: boolean;
	placeholder: string;
	accessibleWorkspaces: IWorkspace[];
	onChange(e: React.ChangeEvent<HTMLInputElement>): void;
	chooseWorkspace(workspaceData: IWorkspace | null): void;
}

export const WorkspaceInput = ({
	value,
	onLoad,
	disabled,
	onChange,
	placeholder,
	chooseWorkspace,
	accessibleWorkspaces
}: IWorkspaceInputProps) => {
	const matches = accessibleWorkspaces.filter((workspace) =>
		workspace.name.toLowerCase().trim().includes(value.toLowerCase().trim())
	);

	const valueIsValidWorkspaceName = matches.find(
		(workspace) => workspace.name === value
	);

	return (
		<div className={styles.inputWrapper}>
			<IntroInput
				type="text"
				value={value}
				onLoad={onLoad}
				onChange={onChange}
				disabled={disabled}
				name="workspaceName"
				placeholder={placeholder}
			/>
			{value !== '' &&
				!valueIsValidWorkspaceName &&
				matches.length > 0 && (
					<div className={styles.dropdownWrapper}>
						<div className={styles.dropdown}>
							{matches.map((workspace) => (
								<div
									key={workspace.id}
									className={styles.match}
									onClick={() => chooseWorkspace(workspace)}
								>
									{workspace.name}
								</div>
							))}
						</div>
					</div>
				)}
		</div>
	);
};
