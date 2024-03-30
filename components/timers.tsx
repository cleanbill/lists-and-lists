import { SEARCH_EVENT, TIMED_NOTES, TimedNote } from "@/types";
import { timeStringDisplay } from "@/utils/dateUtils";
import { useLocalStorage } from "usehooks-ts";

type Props = {
    discard: Function
}

const Timers = (props: Props) => {

    const [timedNotes, _setTimedNotes] = useLocalStorage(TIMED_NOTES, [] as Array<TimedNote>);

    const format = () => {
        const notes = timedNotes.sort((a: TimedNote, b: TimedNote) => {
            const at = new Date(a.time).getTime();
            const bt = new Date(b.time).getTime();
            return at - bt;
        })
        //@ts-ignore
        const noteGroup = Object.groupBy(notes, ({ time }) => {
            const date = new Date(time);
            const dtf = new Intl.DateTimeFormat('en', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
            return dtf.format(date);
        });
        return noteGroup;
    }

    const setSearchText = (text: string) => {
        const ce = new CustomEvent(SEARCH_EVENT, { detail: text });
        document.dispatchEvent(ce);
    }

    const notes = format();
    const noteDates = Object.keys(notes);

    return (
        <>
            {noteDates.map((noteDate: string) => (
                <div key={"noteDate-" + noteDate} >
                    <h2 className="text-sm">{noteDate}</h2>
                    {notes[noteDate].map((f: TimedNote, index: number) => (
                        <div key={"timer-" + index + f.id} className="grid grid-cols-[9fr,2fr,0fr] gap-1 text-yellow-700">
                            <button className="text-start" key={"title-" + index + f.id} onClick={(ev) => setSearchText(f.id)}>{f.id}</button>
                            <label key={'time-' + index + f.id} title={f.time}>{timeStringDisplay("" + f.time)}</label>
                            <button key={'del-time-' + index + f.id} onClick={() => props.discard(f.id)} className="text-red-500">x</button>
                        </div>
                    ))}
                </div>
            ))}
        </>
    )

}

export default Timers;