import { TimedNoteEvent, TimedNoteCommand, TimedNote, TimedNoteAction, RepeatPeriod } from "@/types";
import { log } from "./logUtils";

const worker  = new Worker(new URL('../worker.js', import.meta.url));

let ready = false;

export const setup = (timedNotes: Array<TimedNote>,setSearchText: Function, setTimedNotes: Function) => {
    if (ready){
        return;
    }
    ready = true;
    worker.onmessage = (evnt: MessageEvent<TimedNoteEvent>) => {
        const command = evnt.data.command;
        const list = evnt.data.list;
        if (command == TimedNoteCommand.Display) {
            log(`WebWorker Response => ${list[0].id}`);
            setSearchText(evnt.data.list[0].id);
            // const el = document.getElementById('search-input') as HTMLInputElement;
            // el.value = evnt.data.list[0].id;
        }
        if (command == TimedNoteCommand.List) {
            //list.forEach((tn:TimedNote,i:number) => log(i+'. ',tn));
            setTimedNotes([...list]);
        }
    };
    worker?.postMessage({ command: 'Load', 'timedNote': timedNotes });
    return () => {
        worker?.terminate()
    }
};



export const addTimedNote = (timedNote: TimedNote) => {

    const timedNoteAction: TimedNoteAction = {
        "command": TimedNoteCommand.Add,
        "timedNote": timedNote
    }

    worker?.postMessage(timedNoteAction);
}

export const discard = (id: string) => {
    const command = TimedNoteCommand.Take
    const timedNote: TimedNote = {
      time: "",
      id,
      repeatPeriod: RepeatPeriod.None,
      repeatQty: 0
    };
    const message: TimedNoteAction = { command, timedNote };
    log('sending', message);
    worker?.postMessage(message);
  }

