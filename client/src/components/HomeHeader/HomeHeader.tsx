import { TbLogout2 } from 'react-icons/tb';
import styles from './homeHeader.module.css'

interface IHomeHeaderProps {
    date: string;
    logout(): void;
    lastName: string;
    firstName: string;
    profileImgPath: string;
}

export const HomeHeader = ({
    date,
    logout,
    lastName,
    firstName,
    profileImgPath
}: IHomeHeaderProps) => {
    return (<div className={styles.header}>
        <div className={styles.dashboard}>
            <h1>Dashboard</h1>
            <h4>{date}</h4>
        </div>
        <div className={styles.userData}>
            <div className={styles.profileImgContainer}>
                <img
                    alt="profile-img"
                    src={profileImgPath}
                />
            </div>
            <p className={styles.fullName}>
                {`${firstName} ${lastName}`}
            </p>
            <TbLogout2
                onClick={logout}
                className={styles.logout}
            />
        </div>
    </div>)
}