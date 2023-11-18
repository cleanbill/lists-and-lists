import { TimedNote } from "@/types";
import { timeStringDisplay } from "@/utils/logUtils";
import { useLocalStorage } from "usehooks-ts";

type Props = {
    discard: Function 
}

const Timers = (props:Props) => {

    const [timedNotes, setTimedNotes] = useLocalStorage('timedNotes', [] as Array<TimedNote>);

    return (

        timedNotes?.map((f: TimedNote, index: number) => (
            <div key={index+f.id} className="grid grid-cols-3 text-yellow-700">
                <div>{f.id} </div>
                <div title={f.time}>{timeStringDisplay(""+f.time)}</div>
                <button onClick={()=> props.discard(f.id)} className="text-red-500">x</button>
            </div>

        ))
        
        )

}

export default Timers;