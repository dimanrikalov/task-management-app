import styles from './homeHeader.module.css';

interface IHomeHeaderProps {
    date: string;
    lastName: string;
    firstName: string;
    profileImgPath: string;
}

export const HomeHeader = ({
    date,
    lastName,
    firstName,
    profileImgPath
}: IHomeHeaderProps) => {
    return (
        <div className={styles.header}>
            <div className={styles.dashboard}>
                <h1>Dashboard</h1>

            </div>
            <div className={styles.rightSide}>
                <div className={styles.userData}>
                    <div className={styles.profileImgContainer}>
                        <img alt="profile-img" src={profileImgPath} />
                    </div>
                    <p className={styles.fullName}>{`${firstName} ${lastName}`}</p>
                </div>
                <h4 className={styles.date}>{date}</h4>
            </div>
        </div>
    );
};
