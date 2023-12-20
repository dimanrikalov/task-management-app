import { TbLogout2 } from 'react-icons/tb';
import styles from './homeHeader.module.css'

interface IHomeHeaderProps {
    date: string;
    firstName: string;
    lastName: string;
    logout(): void;
}

export const HomeHeader = ({
    date,
    logout,
    lastName,
    firstName,
}: IHomeHeaderProps) => {
    return (<div className={styles.header}>
        <div className={styles.dashboard}>
            <h1>Dashboard</h1>
            <h4>{date}</h4>
        </div>
        <div className={styles.userData}>
            <div className={styles.userInitialsIcon}>
                {
                    `${firstName[0].toUpperCase()}${lastName[0].toUpperCase()}`
                }
            </div>
            <p className={styles.fullName}>{`${firstName} ${lastName}`}</p>
            <TbLogout2
                onClick={logout}
                className={styles.logout}
            />
        </div>
    </div>)
}