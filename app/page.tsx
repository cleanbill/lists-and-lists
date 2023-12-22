"use client"
import { useRef, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { CURRENT_SESSION, DEFAULT_CURRENT, DEFAULT_STATE, LIST_AND_LISTS, ListData, REPEAT_PERIOD, REPEAT_QTY, RepeatPeriod, SAVE_SWITCH_EVENT, SYNC_TIMED_NOTES, TIMED_NOTES, TimedNote } from "@/types";
import TimePicker from "@/components/timePicker";
import RepeatPicker from "@/components/repeatPicker";
import { discard, setup } from "@/utils/workerUtils";
import SaveButton from "@/components/saveButton";
import SearchField from "@/components/searchField";
import TitleField from "@/components/titleField";
import SidePanel from "@/components/sidePanel";
import SidePanelButton from "@/components/sidePanelButton";
import { log } from "@/utils/logUtils";
import TimeStampSaveTick from "@/components/timestampSaveTick";
import Notes from "@/components/notes";
import SessionPicker from "@/components/sessionPicker";

let workerStopped = true;

export default function Home() {
  const workerRef = useRef<Worker>()

  const [current, setCurrent] = useLocalStorage(CURRENT_SESSION, DEFAULT_CURRENT);
  const [timedNotes, setTimedNotes] = useLocalStorage(TIMED_NOTES, [] as Array<TimedNote>);
  const [showTimers, setShowTimers] = useState(timedNotes.length > 0);
  const [blockedSwitchTitle, setBlockedSwitchTitle] = useState("");

  const [_repeatQty, setRepeatQty] = useLocalStorage(REPEAT_QTY, 0);
  const [_displayAt, setDisplayAt] = useLocalStorage('displayAt', "");
  const [_repeatPeriod, setRepeatPeriod] = useLocalStorage(REPEAT_PERIOD, RepeatPeriod.None);
  const [state, setState] = useLocalStorage(LIST_AND_LISTS, DEFAULT_STATE);

  const switchToSearchText = (t: string) => {
    if (current.unsaved) {
      setBlockedSwitchTitle(t);
      return;
    }
    current.searchText = t;
    setCurrent(current);
  }

  const saveAndSwitch = () => {
    const saveSwitchEvent = new CustomEvent(SAVE_SWITCH_EVENT, { detail: blockedSwitchTitle });
    document.dispatchEvent(saveSwitchEvent);
    setBlockedSwitchTitle("");
  }

  const syncStateWithTimedNotesUpdates = (list: Array<TimedNote>) => {
    const saveSwitchEvent = new CustomEvent(SYNC_TIMED_NOTES, { detail: list });
    document.dispatchEvent(saveSwitchEvent);
    setBlockedSwitchTitle("");
  }

  const updateTimedNotes = (list: Array<TimedNote>) => {
    setTimedNotes(list);
    syncStateWithTimedNotesUpdates(list);
  }

  if (workerStopped) {
    workerStopped = false;
    log('worker setup');
    try {
      workerRef.current = new Worker(new URL('../worker.js', import.meta.url));
      const onMessageFn = setup(workerRef.current);
      workerRef.current.onmessage = onMessageFn(switchToSearchText, updateTimedNotes);
      workerRef.current?.postMessage({ command: 'Load', 'timedNote': timedNotes });
      return () => {
        workerRef.current?.terminate()
      }
    } catch (er) {
      console.error('worker failed ', er);
    }
  } else if (blockedSwitchTitle.length > 0) {
    setBlockedSwitchTitle("");
  }

  const toggleSidePanel = () => {
    const toggled = !showTimers;
    if (!document.startViewTransition) {
      setShowTimers(toggled);
      return;
    }
    document.startViewTransition(() => setShowTimers(toggled));
  }

  return (
    <main className={showTimers ? "m-0 background-[#b0c4de] grid grid-cols-[2fr,11fr]" : "m-0 background-[#b0c4de]"}>
      {showTimers &&
        <SidePanel discard={discard} toggleSidePanel={toggleSidePanel}></SidePanel>}
      <article className={showTimers ? "mt-1 text-black" : "mt-1 text-black"}>
        <SearchField></SearchField>
        <section className="text-white mt-3 w-full ">
          <div className="grid grid-cols-[10fr,2fr,0fr,1fr]">
            <TitleField></TitleField>
            <TimePicker></TimePicker>
            <RepeatPicker></RepeatPicker>
          </div>
          <SessionPicker></SessionPicker>
          {/* <List></List> */}
          <Notes key={current?.listIndex + current?.sessionIndex || "unset"}></Notes>
          <TimeStampSaveTick></TimeStampSaveTick>
          {!showTimers && <SidePanelButton toggleSidePanel={toggleSidePanel}></SidePanelButton>}
        </section>
        <SaveButton></SaveButton>
        {blockedSwitchTitle && <button title="Click to save and switch" onClick={saveAndSwitch} className=" mr-1 ml-10 mt-2 mb-3 bg-red-200 rounded-xl text-black p-3 ">Unsaved - Cannot switch to {blockedSwitchTitle}</button>}
        {/* {current.unsaved && <label className=" mr-1 ml-10 mt-2 mb-3 bg-red-200 rounded-xl text-black p-3 ">Unsaved</label>} */}
      </article>
    </main>
  )
}