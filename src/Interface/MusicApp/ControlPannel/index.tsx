import { ControlBlock } from './ControlBlock';
import { ProcessBlock } from './ProcessBlock';
import { TitleBlock } from './TitleBlock';
import styles from './index.module.scss';

export const ControlPannel = () => {

    return (
        <div className={styles.control}>
            <TitleBlock />
            <ProcessBlock />
            <ControlBlock />
        </div>
    );
}





