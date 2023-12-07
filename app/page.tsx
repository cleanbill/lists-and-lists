"use client"
import List from "@/components/list";
import { useEffect, useRef, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { TimedNote } from "@/types";
import TimePicker from "@/components/timePicker";
import RepeatPicker from "@/components/repeatPicker";
import { discard, setup } from "@/utils/workerUtils";
import SaveButton from "@/components/saveButton";
import { CURRENT, DEFAULT_CURRENT, TIMED_NOTES } from "./model";
import SearchField from "@/components/searchField";
import TitleField from "@/components/titleField";
import SidePanel from "@/components/sidePanel";
import SidePanelButton from "@/components/sidePanelButton";
import { log } from "@/utils/logUtils";
import TimeStampSaveTick from "@/components/timestampSaveTick";
import Notes from "@/components/notes";

export default function Home() {
  const workerRef = useRef<Worker>()

  const [current, setCurrent] = useLocalStorage(CURRENT, DEFAULT_CURRENT);
  const [timedNotes, setTimedNotes] = useLocalStorage(TIMED_NOTES, [] as Array<TimedNote>);
  const [showTimers, setShowTimers] = useState(timedNotes.length > 0);

  const setSearchText = (t: string) => {
    current.searchText = t;
    setCurrent(current);
  }

  useEffect(() => {
    log('Page render');
    try {
      workerRef.current = new Worker(new URL('../worker.js', import.meta.url));
      const onMessageFn = setup(workerRef.current);
      workerRef.current.onmessage = onMessageFn(timedNotes, setSearchText, setTimedNotes);
      workerRef.current?.postMessage({ command: 'Load', 'timedNote': timedNotes });
      return () => {
        workerRef.current?.terminate()
      }
    } catch (er) {
      console.error('worker failed ', er);
    }
  }, [])

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
          <List></List>
          <Notes key={current?.listIndex||"unset"}></Notes>
          <TimeStampSaveTick></TimeStampSaveTick>
          {!showTimers && <SidePanelButton toggleSidePanel={toggleSidePanel}></SidePanelButton>}
        </section>
        <SaveButton></SaveButton>
      </article>
    </main>
  )
}