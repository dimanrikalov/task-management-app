import { FaEdit } from 'react-icons/fa';
import styles from './entryModificationForm.module.css';
import { EntryModificationButton } from '../Buttons/EntryModificationButton/EntryModificationButton';

interface IEntryModificationForm {
    name: string;
    value: string;
    placeholder?: string;
    onSubmit: React.FormEventHandler<HTMLFormElement>;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
}

export const EntryModificationForm = ({
    name,
    value,
    onSubmit,
    onChange,
    placeholder
}: IEntryModificationForm) => {
    return (
        <form onSubmit={onSubmit} className={styles.form}>
            <input
                type="text"
                name={name}
                value={value}
                onChange={onChange}
                className={styles.input}
                placeholder={placeholder}
            />
            <EntryModificationButton>
                <FaEdit className={styles.icon} />
            </EntryModificationButton>
        </form>
    );
};
