import { RepeatPeriod } from "@/types";
import { useLocalStorage } from "usehooks-ts";


const RepeatPicker = () => {

    const [repeatPeriod, setRepeatPeriod] = useLocalStorage('repeatPeriod',RepeatPeriod.None);
    const [repeatQty, setRepeatQty] = useLocalStorage('repeatQty',0);

    const onSelect = (ev: any) => {
        if (!ev.target['validity'].valid) return;
        const value = ev.target['value'];
        setRepeatPeriod(value);
    };

    const onChange = (ev: any) => {
        if (!ev.target['validity'].valid) return;
        const value = ev.target['value'];
        setRepeatQty(value);
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