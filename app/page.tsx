"use client"
import List from "@/components/list";
import Title from "@/components/title";
import { useRef, useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";
import { log } from '../utils/logUtils';
import { RepeatPeriod, TimedNote, TimedNoteAction, TimedNoteCommand, TimedNoteEvent } from "@/types";
import Timers from "@/components/timers";
import TimePicker from "@/components/timePicker";
import RepeatPicker from "@/components/repeatPicker";

export default function Home() {
  const [title, setTitle] = useLocalStorage('title', '');

  const [searchText, setSearchText] = useLocalStorage('searchText', '');
  const workerRef = useRef<Worker>()
  const [timedNotes, setTimedNotes] = useLocalStorage('timedNotes', [] as Array<TimedNote>);

  let time = new Date();

  useEffect(() => {
    workerRef.current = new Worker(new URL('../worker.js', import.meta.url))
    workerRef.current.onmessage = (evnt: MessageEvent<TimedNoteEvent>) => {
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
    workerRef.current?.postMessage({ command: 'Load', 'timedNote': timedNotes });
    return () => {
      workerRef.current?.terminate()
    }
  }, []);

  const addTimedNote = (timedNote:TimedNote) => {

    const timedNoteAction: TimedNoteAction = {
      "command": TimedNoteCommand.Add,
      "timedNote": timedNote
    }

    workerRef.current?.postMessage(timedNoteAction);
  }

  const discard = (id: string) => {
    const command = TimedNoteCommand.Take
    const timedNote: TimedNote = {
      time: "",
      id,
      repeatPeriod: RepeatPeriod.None,
      repeatQty: 0
    };
    const message: TimedNoteAction = { command, timedNote };
    log('sending', message);
    workerRef.current?.postMessage(message);
  }


  const changingTitle = (t: string) => {
    setSearchText(t);
    setTitle(t);
  }

  return (
    <main className="m-0 background-[#b0c4de]">
      <div className="mt-10 ml-10 mr-10 text-black">
        <search className="grid grid-cols-[0fr,12fr] gap-2">
          <div className="mt-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-5 w-5">
            <path
              fill-rule="evenodd"
              d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
              clip-rule="evenodd" />
          </svg>
          </div>
          <input id='search-input' defaultValue={searchText} autoFocus onChange={(e) => setSearchText(e.target.value)} className='lg:ml-10 lg:w-10/12 sm:w-full h-10 ps-2 pe-2' placeholder="Search"></input>
        </search>

        <div className="text-white mt-3 w-full ">
          <Title value={title} onchange={changingTitle}></Title>
          <TimePicker ></TimePicker>
          <RepeatPicker ></RepeatPicker>
          <List addTimedNote={addTimedNote} updateTitle={changingTitle} title={title}></List>
          <Timers discard={discard}></Timers>
        </div>
      </div>
    </main>
  )
}
