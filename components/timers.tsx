import { TimedNote } from "@/types";
import { timeStringDisplay } from "@/utils/logUtils";
import Link from "next/link";
import { useLocalStorage } from "usehooks-ts";

type Props = {
    discard: Function
}

const Timers = (props: Props) => {

    const [timedNotes, _setTimedNotes] = useLocalStorage('timedNotes', [] as Array<TimedNote>);

    return (
        <>
            {timedNotes?.map((f: TimedNote, index: number) => (
                <span key={"timer-"+index + f.id} className="grid grid-cols-[9fr,2fr,0fr] gap-1 text-yellow-700">
                    <Link key={"title-"+index + f.id} href={"?title="+f.id}>{f.id}  </Link>
                    <label key={'time-' + index + f.id} title={f.time}>{timeStringDisplay("" + f.time)}</label>
                    <button key={'del-time-' + index + f.id} onClick={() => props.discard(f.id)} className="text-red-500">x</button>
                </span>
            ))}
        </>
    )

}

export default Timers;