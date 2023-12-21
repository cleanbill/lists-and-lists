import { CURRENT_SESSION, DEFAULT_CURRENT } from "@/types";
import { useLocalStorage } from "usehooks-ts";

const TimePicker = () => {

    const [displayAt, setDisplayAt] = useLocalStorage('displayAt', "");
    const [title, _setTitle] = useLocalStorage('title', '');
    const [current, setCurrent] = useLocalStorage(CURRENT_SESSION, DEFAULT_CURRENT);

    const onChange = (ev: any) => {
        if (!ev.target['validity'].valid) return;
        if (!ev.target['value']) return;
        const value= ev.target['value'] + ':00Z';
        setDisplayAt(value);
        current.unsaved = true;
        setCurrent(current);
    };

    const min = new Date().toISOString().substring(0,19)+'Z';

    return (
        <>
            <input
                className="text-black h-10 w-full mt-3 rounded m-1 p-1"
                min={min}
                id={'pick-time-'+title}
                type="datetime-local"
                value={(displayAt || '').toString().substring(0, 16)}
                onChange={onChange}
                name="pick-time"
            />
        </>
    )
}

export default TimePicker;