import { CURRENT_SESSION, DEFAULT_CURRENT, REPEAT_PERIOD, REPEAT_QTY, RepeatPeriod } from "@/types";
import { useLocalStorage } from "usehooks-ts";


const RepeatPicker = () => {

    const [repeatPeriod, setRepeatPeriod] = useLocalStorage(REPEAT_PERIOD,RepeatPeriod.None);
    const [repeatQty, setRepeatQty] = useLocalStorage(REPEAT_QTY,0);
    const [current, setCurrent] = useLocalStorage(CURRENT_SESSION, DEFAULT_CURRENT);

    const onSelect = (ev: any) => {
        if (!ev.target['validity'].valid) return;
        const value = ev.target['value'];
        setRepeatPeriod(value);
        current.unsaved = true;
        setCurrent(current);
    };

    const onChange = (ev: any) => {
        if (!ev.target['validity'].valid) return;
        const value = ev.target['value'];
        setRepeatQty(value);
        current.unsaved = true;
        setCurrent(current);
    };

    return (
        <>
            <input onChange={onChange} defaultValue={repeatQty} className="text-black w-14 h-10 mt-3 ml-2 mr-2 rounded-xl p-2 m-1" maxLength={1} type="number"></input>
            <select
                className="text-black h-10 rounded-xl p-1 mt-3 mr-2"
                value={(repeatPeriod || '').toString().substring(0, 16)}
                onChange={onSelect}
                id="repeatPeriod"
                name="repeatPeriod"
            >
                <option value="None">None</option>
                <option value="Days">Days</option>
                <option value="Weeks">Weeks</option>
                <option value="Months">Months</option>
                <option value="Years">Years</option>
            </select>
        </>
    )
}

export default RepeatPicker;