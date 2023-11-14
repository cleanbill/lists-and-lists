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
            <input onChange={onChange} defaultValue={repeatQty} className="text-black w-10 ml-2 mr-2" maxLength={1} type="number"></input>
            <select
                className="text-black h-10"
                value={(repeatPeriod || '').toString().substring(0, 16)}
                onChange={onSelect}
                id="pick-time"
                name="pick-time"
                defaultValue="None"
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