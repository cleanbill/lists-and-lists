import { useLocalStorage } from "usehooks-ts";

const TimePicker = () => {

    const [displayAt, setDisplayAt] = useLocalStorage('displayAt', "");
    const [title, setTitle] = useLocalStorage('title', '');

    const onChange = (ev: any) => {
        if (!ev.target['validity'].valid) return;
        const value= ev.target['value'] + ':00Z';
        setDisplayAt(value);
    };

    const min = new Date().toISOString().substring(0,19)+'Z';

    return (
        <>
            <input
                className="text-black h-10"
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