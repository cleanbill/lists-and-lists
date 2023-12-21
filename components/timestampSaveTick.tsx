import { CURRENT_SESSION, DEFAULT_CURRENT, TIMESTAMP_SAVE } from "@/types";
import { useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";


const TimeStampSaveTick = () => {

    const [timestampSave, setTimestampSave] = useLocalStorage(TIMESTAMP_SAVE, false);
    const [current, setCurrent] = useLocalStorage(CURRENT_SESSION, DEFAULT_CURRENT);

    const switchTimeStampSave = (ev: any) => {
        const value: boolean = ev.target.checked;
        setTimestampSave(value);
        current.unsaved = true;
        setCurrent(current);
    }

    return (
        <>
            <span className='float-right'>
                <label htmlFor='timestamp-switch' className='mr-2 mt-1 text-xs text-yellow-600'>timestamp save</label>
                <input onChange={switchTimeStampSave} defaultChecked={timestampSave} id='timestamp-switch' type="checkbox" className=" float-right text-black p-3 mt-2 mr-3"></input>
            </span>
            <br></br>
        </>
    )
}


export default TimeStampSaveTick