import { TimedNoteEvent, TimedNoteCommand, TimedNote, TimedNoteAction, RepeatPeriod } from "@/types";
import { log } from "./logUtils";

let worker:any = null;

export const setup = (w:any)=>{
    worker = w;
    return (changeSearchText: Function, setTimedNotes: Function) => (messageEvent: MessageEvent<TimedNoteEvent>) => {
        const command = messageEvent.data.command;
        const list = messageEvent.data.list;
        if (command == TimedNoteCommand.Display) {
            log(`WebWorker Response => ${list[0].id}`);
            changeSearchText(messageEvent.data.list[0].id);
            // const el = document.getElementById('search-input') as HTMLInputElement;
            // el.value = messageEvent.data.list[0].id;
        }
        if (command == TimedNoteCommand.List) {
            //list.forEach((tn:TimedNote,i:number) => log(i+'. ',tn));
            setTimedNotes([...list]);
        }
    };
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

