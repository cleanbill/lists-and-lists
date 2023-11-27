import { CURRENT, CurrentState, DISPLAY_AT, FIELDS, LIST_TITLE, ListData, REPEAT_PERIOD, REPEAT_QTY, TIMESTAMP_SAVE, UIData } from "@/app/model";
import { log } from "./logUtils";
import { SearchResults } from "./searchUtils";

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

const getBooleanItem = (key: string): boolean =>{
    const item = getItem(key);
    if (item.length == 0){
        return false;
    }
    return item == 'true';
}

const getNUmberItem = (key: string): number =>{
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

export const obtainUI = (): UIData => {
    const listTitle = getItem(LIST_TITLE);
    const timestampSave = getBooleanItem(TIMESTAMP_SAVE);
    const fields = getArrayItem(FIELDS);
    const displayAt = getItem(DISPLAY_AT);
    const repeatPeriod = getItem(REPEAT_PERIOD);
    const repeatQty = getNUmberItem(REPEAT_QTY);
    return {
        'listTitle': listTitle,
        'timestampSave': timestampSave,
        'fields': fields,
        'displayAt': displayAt,
        'repeatPeriod': repeatPeriod,
        'repeatQty': repeatQty
    } as UIData;
}