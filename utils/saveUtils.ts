import { UIData, ListData, DEFAULT_LIST, UpdateState, StoredState, ListSession } from '@/types';
import { search } from '../utils/searchUtils'

const z = (n: number) => n < 10 ? "0" + n : n + "";
export const makeMark = (includeMinutes = true) => {
    const now = new Date();
    const minutes = includeMinutes ? z(now.getMinutes()) : "00";
    const seconds = includeMinutes ? z(now.getSeconds()) : "00";
    const mark = now.getFullYear() + "-" + z(now.getMonth() + 1) + "-" + z(now.getDate()) + ":" + z(now.getHours()) + ':' + minutes+":"+seconds;
    return mark;
}

const updateListData = (ui: UIData, listData: ListData): ListData => {
    listData.displayAt = ui.displayAt;
    listData.listTitle = ui.listTitle;
    listData.repeatPeriod = ui.repeatPeriod;
    listData.repeatQty = ui.repeatQty;
    listData.timestampSave = ui.timestampSave;
    return listData;
}

const createListData = (ui: UIData, listData = DEFAULT_LIST, sessionIndex = 0): ListData => {
    const newListData = updateListData(ui, listData);
    newListData.sessions[sessionIndex].mark = makeMark();
    newListData.sessions[sessionIndex].fields = ui.fields;
    newListData.sessions[sessionIndex].note = ui.note;
    return newListData;
}

const updateWithChangedTitle = (updateState: UpdateState) => {
    const currentTitleData = updateState.stored.lists[updateState.current.listIndex];
    currentTitleData.sessions[updateState.current.sessionIndex].mark = makeMark();
    const found = search(updateState.ui.listTitle, updateState.stored.lists);
    if (found && !updateState.allowOverwrite) {
        throw new Error('Duplicate');
    }

    if (found) {
        console.log('switched title to ', updateState.ui.listTitle);
        updateState.stored.lists[found.listIndex] = createListData(updateState.ui,
            updateState.stored.lists[found.listIndex],
            found.sessionIndex);
        updateState.current.listIndex = found.listIndex;
        updateState.current.sessionIndex = found.sessionIndex;
        return updateState.stored;
    }

    // add new List
    updateState.stored.lists.push(createListData(updateState.ui));
    updateState.current.listIndex = updateState.stored.lists.length - 1;
    updateState.current.sessionIndex = 0
    return updateState.stored;
}

const updateSession = (updateState: UpdateState): StoredState => {
    const storedList = updateState.stored.lists[updateState.current.listIndex];
    if (updateState.ui.timestampSave) {
        const newSession: ListSession = {
            mark: makeMark(),
            note: updateState.ui.note
        };
        const updatedList = updateListData(updateState.ui, storedList);
        updatedList.sessions.push(newSession);
        updateState.stored.lists[updateState.current.listIndex] = updatedList;
        updateState.current.sessionIndex = updatedList.sessions.length - 1;
        const storedState = updateState.stored; 
        return storedState;
    }

    const updatedList = createListData(updateState.ui, storedList, updateState.current.sessionIndex);
    updateState.stored.lists[updateState.current.listIndex] = updatedList;
    return updateState.stored;
}

const doUpdate = (updateState: UpdateState): StoredState => {
    const storedList = updateState.stored.lists[updateState.current.listIndex];
    if (storedList.listTitle != updateState.ui.listTitle) {
        return updateWithChangedTitle(updateState);
    } else {
        return updateSession(updateState);
    }
}

export const applyUpdate = (updateState: UpdateState): StoredState => {
    if (updateState.stored.lists.length == 0) {
        updateState.stored.lists = [createListData(updateState.ui)];
        return updateState.stored;
    }
    const newState = doUpdate(updateState);
    return newState;
}