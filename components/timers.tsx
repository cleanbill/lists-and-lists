import { TimedNote } from "@/types";
import { timeStringDisplay } from "@/utils/logUtils";
import { useLocalStorage } from "usehooks-ts";

type Props = {
    discard: Function
}

const Timers = (props: Props) => {

    const [timedNotes, _setTimedNotes] = useLocalStorage('timedNotes', [] as Array<TimedNote>);

    return (
        <div className="grid grid-cols-[9fr,2fr,0fr] gap-1 text-yellow-700">
            {timedNotes?.map((f: TimedNote, index: number) => (
                <>
                    <div key={index + f.id}>{f.id} </div>
                    <div key={'time-' + index + f.id} title={f.time}>{timeStringDisplay("" + f.time)}</div>
                    <button key={'del-time-' + index + f.id} onClick={() => props.discard(f.id)} className="text-red-500">x</button>
                </>
            ))}
        </div>
    )

}

export default Timers;