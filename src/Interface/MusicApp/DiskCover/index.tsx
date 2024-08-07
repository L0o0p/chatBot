import { useAtom } from 'jotai';

// import { useState } from 'react';
import styles from './index.module.scss'
import { isPlayingAtom, useCurrentAudio } from '../../store';
import { MusicPlayer } from '../MusicPlayer';
// import { ListCom } from '../ListCom';

export const DiskCover = () => {
    const { currentAudio } = useCurrentAudio()
    const imgUrl = currentAudio.imageUrl
    const [isPlaying] = useAtom(isPlayingAtom);
    // const [display, setDis] = useState(false)
    // const changeDisplay = () => setDis(!display)

    return (
        <div className={styles.cover}>

            {/* <div className={styles.ListCom} style={display ? { backgroundColor: ' #242424' } : {}}>
                <ListCom display={display} setDis={changeDisplay} />
            </div> */}
            <img
                className={isPlaying ? styles.diskImg : styles.img}
                src={imgUrl}
                alt="💿 Cover"
            />
            <MusicPlayer />

        </div>
    )
}