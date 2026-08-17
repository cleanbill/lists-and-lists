import { CURRENT_SESSION, DEFAULT_CURRENT, LIST_TITLE, Note, NOTES, REPEAT_PERIOD, REPEAT_QTY, RepeatPeriod } from "@/types";
import { useLocalStorage } from "usehooks-ts";

const CLEAR_BUTTON_ID = 'CLEAR-button';

const ClearButton = () => {

    const [note, setNote] = useLocalStorage(NOTES, null as Note);
    const [title, setTitle] = useLocalStorage(LIST_TITLE, '');
    const [current, setCurrent] = useLocalStorage(CURRENT_SESSION, DEFAULT_CURRENT);
    const [repeatPeriod, setRepeatPeriod] = useLocalStorage(REPEAT_PERIOD, RepeatPeriod.None);
    const [repeatQty, setRepeatQty] = useLocalStorage(REPEAT_QTY, 0);

    const clearClicked = () => {
        setNote("")
        setTitle("")
        setCurrent(DEFAULT_CURRENT);
        setRepeatPeriod(RepeatPeriod.None);
        setRepeatQty(0);
    }

    return (
        <>
            <button id={CLEAR_BUTTON_ID} onClick={() => clearClicked()} className="float-left ml-4 mt-2 mb-3 bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700 focus:outline-none focus:ring focus:ring-yellow-300  rounded-xl text-black pt-1 pb-1 pl-2 pr-2 ">Clear</button>
        </>
    )
}

export default ClearButton;