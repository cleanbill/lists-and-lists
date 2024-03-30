import { DEFAULT_STATE, LIST_AND_LISTS, ListData, SEARCH_EVENT, TIMED_NOTES, TimedNote } from "@/types";
import { dateStringSort, dateStringDisplay } from "@/utils/dateUtils";
import { useMemo } from "react";
import { useLocalStorage } from "usehooks-ts";

type Props = {
    discard: Function
}

const Lost = (props: Props) => {

    const [state, _setState] = useLocalStorage(LIST_AND_LISTS, DEFAULT_STATE);
    const [timedNotes, _setTimedNotes] = useLocalStorage(TIMED_NOTES, [] as Array<TimedNote>);

    const notes = useMemo(() => {
        const noteGroup = state.lists.filter((ld: ListData) => {
            const found = timedNotes.find((tn: TimedNote) => tn.id.toLowerCase().trim() == ld.listTitle.toLowerCase().trim());
            return !found;
        }).sort((ldA: ListData, ldB: ListData) => dateStringSort(ldA.displayAt + '', ldB.displayAt + ''));
        return noteGroup;
    }, [state]);

    const setSearchText = (text: string) => {
        const ce = new CustomEvent(SEARCH_EVENT, { detail: text });
        document.dispatchEvent(ce);
    }

    if (notes.length == 0) {
        return null;
    }

    return (
        <div>
            <h1 className="mt-3">LOST LIST</h1>
            {notes.map((noteDate: ListData, index: number) => (
                <div key={"timer-" + index + noteDate.listTitle} className="grid grid-cols-[9fr,2fr,0fr] gap-1 text-yellow-700">
                    <button className="text-start" key={"title-" + index + noteDate.listTitle} onClick={(ev) => setSearchText(noteDate.listTitle)}>{noteDate.listTitle}</button>
                    <label key={'time-' + index + noteDate.listTitle} title={'' + noteDate.displayAt}>{dateStringDisplay("" + noteDate.displayAt)}</label>
                    <button key={'del-time-' + index + noteDate.listTitle} onClick={() => props.discard(noteDate.listTitle)} className="text-red-500">x</button>
                </div>
            ))}
        </div>
    )

}

export default Lost;