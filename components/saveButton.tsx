import { CURRENT, DEFAULT_CURRENT, DEFAULT_STATE, LIST_AND_LISTS, UpdateState } from "@/app/model";
import { TimedNote } from "@/types";
import { obtainUI } from "@/utils/localUtils";
import { log } from "@/utils/logUtils";
import { applyUpdate } from "@/utils/saveUtils";
import { addTimedNote } from "@/utils/workerUtils";
import { useState } from "react";
import { useLocalStorage } from "usehooks-ts";

const SAVE_BUTTON_ID = 'save-button';

const SaveButton = () => {

    const [state, setState] = useLocalStorage(LIST_AND_LISTS, DEFAULT_STATE);
    const [current, setCurrent] = useLocalStorage(CURRENT, DEFAULT_CURRENT);

    const [showSavingToast, setShowSavedToast] = useState(false);
    const [showDuplicateToast, setDuplicateToast] = useState(false);
    const [allowOverwrite, setAllowOverwrite] = useState(false);

    const getUpdateState = (): UpdateState => {
        const updateState: UpdateState = {
            current,
            stored: state,
            ui: obtainUI(),
            allowOverwrite
        };
        return updateState;
    }


    const saveClicked = () => {
        setShowSavedToast(true);
        setTimeout(() => setShowSavedToast(false), 5000);
        const saveBut = document.getElementById(SAVE_BUTTON_ID) as HTMLButtonElement;
        saveBut.disabled = true;
        const updateState = getUpdateState();
        try {
            const state = applyUpdate(updateState);
            setState(state);
        } catch (er) {
            log("" + er);
            // overwrite error dialog... to set overwrite
            setDuplicateToast(true);
            setTimeout(() => setDuplicateToast(false), 5000);
            saveBut.disabled = false;
            return;
        }

        if (updateState.ui.displayAt && updateState.ui.displayAt.length > 19) {
            const timedNote: TimedNote = {
                time: updateState.ui.displayAt,
                id: updateState.ui.listTitle,
                repeatPeriod: updateState.ui.repeatPeriod,
                repeatQty: updateState.ui.repeatQty
            }
            addTimedNote(timedNote);
        }
        saveBut.disabled = false;
    }

    return (
        <>

            <button id={SAVE_BUTTON_ID} onClick={() => saveClicked()} className="float-right mr-1 ml-10 mt-2 mb-3 bg-violet-500 hover:bg-violet-600 active:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-300  rounded-xl text-black p-3 ">Save</button>
            {showSavingToast && <label className=" mr-1 ml-10 mt-2 mb-3 bg-red-200 rounded-xl text-black p-3 ">Saved</label>}
            {showDuplicateToast && <label className=" mr-1 ml-10 mt-2 mb-3 bg-red-200 rounded-xl text-black p-3 ">Cannot Save Duplicate List</label>}
        </>
    )
}

export default SaveButton;