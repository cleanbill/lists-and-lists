import { ListData, TimedNote, StoredState } from "@/types";
import { syncLocalStorage } from "./localUtils";

const syncStateData = (data: ListData, timedNote: TimedNote) => {
    data.repeatPeriod = timedNote.repeatPeriod;
    data.repeatQty = timedNote.repeatQty;
    data.displayAt = timedNote.time;
    return data
}

const find = (id: string, list: Array<TimedNote>): TimedNote | false => {
    const index = list.findIndex((tn: TimedNote) => tn.id == id);
    if (index == -1) {
        return false;
    }
    return list[index];
}

export const syncState = (currentListIndex: number, state: StoredState, list: Array<TimedNote>) => {
    let updated = false;
    const newList = state.lists.map((data: ListData, index: number) => {
        const timedNote = data?.listTitle ? find(data.listTitle, list) : false;
        if (!timedNote) {
            return data;
        }
        updated = true;
        if (currentListIndex == index) {
            syncLocalStorage(timedNote);
        }
        const updatedData = syncStateData(data, timedNote);
        return updatedData;
    });
    if (updated) {
        return { lists: [...newList]};
    }
    return false;
}