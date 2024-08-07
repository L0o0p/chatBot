import { TextApp } from "./TextApp";
import styles from './interface.module.scss'

export const Interface = () => {

    return (
        <>
            <div className={styles.superContainer }>
                <TextApp />
            </div>
        </>
    );
}