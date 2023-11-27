"use client"
import List from "@/components/list";
import { useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { log } from '../utils/logUtils';
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


export default function Home() {

  const [current, setCurrent] = useLocalStorage(CURRENT, DEFAULT_CURRENT);
  const [timedNotes, setTimedNotes] = useLocalStorage(TIMED_NOTES, [] as Array<TimedNote>);
  const [showTimers, setShowTimers] = useState(timedNotes.length > 0);

  const setSearchText = (t: string) => {
    if (t == current.searchText) {
      return;
    }
    current.searchText = t;
    setCurrent(current);
  }

  setup(timedNotes, setSearchText, setTimedNotes);

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
      {showTimers && <SidePanel discard={discard} toggleSidePanel={toggleSidePanel}></SidePanel>}

      <div className={showTimers ? "mt-10 text-black" : "mt-10 text-black"}>
       <SearchField></SearchField>

        <section className="text-white mt-3 w-full ">
          <TitleField></TitleField>
          <TimePicker ></TimePicker>
          <RepeatPicker ></RepeatPicker>
          <List></List>
          {!showTimers && <SidePanelButton toggleSidePanel={toggleSidePanel}></SidePanelButton>}
        </section>
        <SaveButton></SaveButton>
      </div>
    </main>
  )
}