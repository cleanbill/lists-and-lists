import { DEFAULT_STATE, LIST_AND_LISTS, ListData, SEARCH_EVENT, TimedNote } from "@/types";
import { useMemo } from "react";
import { useLocalStorage } from "usehooks-ts";

const Timeless = () => {

    const [state, _setState] = useLocalStorage(LIST_AND_LISTS, DEFAULT_STATE);

    const notes = useMemo(() => {
        const noteGroup = state.lists.filter((ld: ListData) => !ld.displayAt || ld.displayAt.length < 19);
        return noteGroup;
    }, [state]);

    const setSearchText = (text: string) => {
        const ce = new CustomEvent(SEARCH_EVENT, { detail: text });
        document.dispatchEvent(ce);
    }

    if (notes.length == 0 ){
        return null;
    }

    return (
        <div>
            <h1>TIMELESS LIST</h1>
            {notes.map((noteDate: ListData, index: number) => (
                <div key={"timer-" + index + noteDate.listTitle} className="grid grid-cols-[9fr,2fr,0fr] gap-1 text-yellow-700">
                    <button key={"title-" + index + noteDate.listTitle} onClick={(ev) => setSearchText(noteDate.listTitle)}>{noteDate.listTitle}</button>
                </div>
            ))}
        </div>
    )

}

export default Timeless;