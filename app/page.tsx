"use client"
import List from "@/components/list";
import { useEffect, useRef, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { TimedNote } from "@/types";
import TimePicker from "@/components/timePicker";
import RepeatPicker from "@/components/repeatPicker";
import { discard, setup } from "@/utils/workerUtils";
import SaveButton from "@/components/saveButton";
import { CURRENT_SESSION, DEFAULT_CURRENT, SAVE_SWITCH_EVENT, TIMED_NOTES } from "./model";
import SearchField from "@/components/searchField";
import TitleField from "@/components/titleField";
import SidePanel from "@/components/sidePanel";
import SidePanelButton from "@/components/sidePanelButton";
import { log } from "@/utils/logUtils";
import TimeStampSaveTick from "@/components/timestampSaveTick";
import Notes from "@/components/notes";

let workerStopped = true;

export default function Home() {
  const workerRef = useRef<Worker>()

  const [current, setCurrent] = useLocalStorage(CURRENT_SESSION, DEFAULT_CURRENT);
  const [timedNotes, setTimedNotes] = useLocalStorage(TIMED_NOTES, [] as Array<TimedNote>);
  const [showTimers, setShowTimers] = useState(timedNotes.length > 0);
  const [blockedSwitchTitle, setBlockedSwitchTitle] = useState("");

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

  if (workerStopped) {
    workerStopped = false;
    log('worker setup');
    try {
      workerRef.current = new Worker(new URL('../worker.js', import.meta.url));
      const onMessageFn = setup(workerRef.current);
      workerRef.current.onmessage = onMessageFn(switchToSearchText, setTimedNotes);
      workerRef.current?.postMessage({ command: 'Load', 'timedNote': timedNotes });
      return () => {
        workerRef.current?.terminate()
      }
    } catch (er) {
      console.error('worker failed ', er);
    }
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
          {/* <List></List> */}
          <Notes key={current?.listIndex || "unset"}></Notes>
          <TimeStampSaveTick></TimeStampSaveTick>
          {!showTimers && <SidePanelButton toggleSidePanel={toggleSidePanel}></SidePanelButton>}
        </section>
        <SaveButton></SaveButton>
        {blockedSwitchTitle && <button onClick={saveAndSwitch} className=" mr-1 ml-10 mt-2 mb-3 bg-red-200 rounded-xl text-black p-3 ">Unsaved - Cannot switch to {blockedSwitchTitle}</button>}
        {/* {current.unsaved && <label className=" mr-1 ml-10 mt-2 mb-3 bg-red-200 rounded-xl text-black p-3 ">Unsaved</label>} */}
      </article>
    </main>
  )
}