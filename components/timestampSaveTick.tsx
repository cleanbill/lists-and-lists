import { TIMESTAMP_SAVE } from "@/app/model";
import { useLocalStorage } from "usehooks-ts";


const TimeStampSaveTick = () => {

    const [timestampSave, setTimestampSave] = useLocalStorage(TIMESTAMP_SAVE, false);

    const switchTimeStampSave = (ev: any) => {
        const value: boolean = ev.target.checked;
        setTimestampSave(value);
    }

    return (
        <>
            <span className='float-right'>
                <label htmlFor='timestamp-switch' className='mr-2 mt-1 text-xs text-yellow-600'>timestamp save</label>
                <input onChange={switchTimeStampSave} value={timestampSave + ''} id='timestamp-switch' type="checkbox" className=" float-right text-black p-3 mt-2 mr-3"></input>
            </span>
            <br></br>
        </>
    )
}


export default TimeStampSaveTick