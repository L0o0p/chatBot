import 'reset-css'
import './App.css';
import { ControlPannel } from './ControlPannel';
import { DiskCover } from './DiskCover';
import { InputPannel } from './InputPannel';
import { ListCom } from './ListCom';

const MusicApp = () => {
    return (<>
        <div className="container">
            <ListCom />
            <DiskCover />
            <ControlPannel />
            <InputPannel />
        </div>
    </>)
}
