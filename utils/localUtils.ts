import { LocalData, UIData, LIST_TITLE, TIMESTAMP_SAVE, FIELDS, DISPLAY_AT, REPEAT_PERIOD, REPEAT_QTY, NOTES, LIST_AND_LISTS, CURRENT_SESSION, StoredState, CurrentState } from "@/types";
import { log } from "./logUtils";

const getItem = (key: string): string => {
    const jsonString = localStorage.getItem(key);
    if (!jsonString) {
        return "";
    }
    try {
        return JSON.parse(jsonString);
    } catch (er) {
        log('can\'t parse "' + jsonString + '"', er);
        return "";
    }
}

const getObject = (key: string): object => {
    const jsonString = localStorage.getItem(key);
    if (!jsonString) {
        return {};
    }
    try {
        return JSON.parse(jsonString);
    } catch (er) {
        log('can\'t parse "' + jsonString + '"', er);
        return {};
    }
}

const getBooleanItem = (key: string): boolean =>{
    const jsonString = localStorage.getItem(key);
    if (!jsonString) {
        return false;
    }
    try {
        return JSON.parse(jsonString);
    } catch (er) {
        log('can\'t parse "' + jsonString + '"', er);
        return false;
    }
}

const getNumberItem = (key: string): number =>{
    const item = getItem(key);
    if (item.length == 0){
        return -1;
    }
    return parseInt(item);
}


const getArrayItem = (key: string): [] =>{
    const jsonString = localStorage.getItem(key);
    if (!jsonString) {
        return [];
    }
    try {
        return JSON.parse(jsonString);
    } catch (er) {
        log('can\'t parse "' + jsonString + '"', er);
        return [];
    }
}

// export const setCurrentState = (list:ListData,found:SearchResults, searchText: string) =>{

//     const session = list.sessions[found.sessionIndex];
//     const listsFields = session.fields;
//     localStorage.setItem(LIST_TITLE,list.listTitle);
//     localStorage.setItem(TIMESTAMP_SAVE,""+list.timestampSave);
//     localStorage.setItem(FIELDS,JSON.stringify(listsFields));
//     localStorage.setItem(DISPLAY_AT,list.displayAt|| "");
//     localStorage.setItem(REPEAT_PERIOD,list.repeatPeriod);
//     localStorage.setItem(REPEAT_QTY,""+list.repeatQty);

//     const newPlace:CurrentState = {
//         listIndex: found.listIndex,
//         sessionIndex: found.sessionIndex,
//         searchText
//     };
//     localStorage.setItem(CURRENT,JSON.stringify(newPlace));
// }

export const obtainState = (): LocalData =>{
    const localData:LocalData = {
        UIData: obtainUI(),
        storedData: getObject(LIST_AND_LISTS) as StoredState,
        current: getObject(CURRENT_SESSION) as CurrentState
    };
    return localData;
}

export const obtainUI = (): UIData => {
    const listTitle = getItem(LIST_TITLE);
    const timestampSave = getBooleanItem(TIMESTAMP_SAVE);
    const fields = getArrayItem(FIELDS);
    const displayAt = getItem(DISPLAY_AT);
    const repeatPeriod = getItem(REPEAT_PERIOD);
    const repeatQty = getNumberItem(REPEAT_QTY);
    const note = getItem(NOTES);

    return {
        'listTitle': listTitle,
        'timestampSave': timestampSave,
        'fields': fields,
        'note':note,
        'displayAt': displayAt,
        'repeatPeriod': repeatPeriod,
        'repeatQty': repeatQty
    } as UIData;
}