import styles from './workspaceInput.module.css';
import { IntroInput } from '../Inputs/IntroInput/IntroInput';
import { IWorkspace } from '@/views/CreateBoardView/CreateBoard.viewmodel';

interface IWorkspaceInputProps {
    value: string;
    disabled?: boolean;
    accessibleWorkspaces: IWorkspace[],
    chooseWorkspace(workspaceData: IWorkspace | null): void,
    onChange(e: React.ChangeEvent<HTMLInputElement>): void;
    onLoad?(): any;
}

export const WorkspaceInput = ({
    value,
    onLoad,
    disabled,
    onChange,
    chooseWorkspace,
    accessibleWorkspaces
}: IWorkspaceInputProps) => {
    const matches = accessibleWorkspaces
        .filter(workspace => workspace.name.toLowerCase().trim().includes(value.toLowerCase().trim()));

    const valueIsValidWorkspaceName = matches.find(workspace => workspace.name === value);

    return <div>
        <IntroInput
            type="text"
            value={value}
            onLoad={onLoad}
            onChange={onChange}
            disabled={disabled}
            name="workspaceName"
            placeholder="Enter a workspace name"
        />
        {
            value !== '' && !valueIsValidWorkspaceName && matches.length > 0 &&
            <div className={styles.dropdownWrapper}>
                <div className={styles.dropdown}>
                    {
                        matches.map((workspace) =>
                            <div
                                key={workspace.id}
                                className={styles.match}
                                onClick={() => chooseWorkspace(workspace)}
                            >
                                {workspace.name}
                            </div>
                        )
                    }
                </div>
            </div>
        }
    </div>
}