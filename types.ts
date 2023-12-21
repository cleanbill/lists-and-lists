import { makeMark } from "@/utils/saveUtils";

export enum FieldComponentType {
    NONE = "N/A",
    HAPPY = 'HAPPY',
    ETL = 'EXTENDABLE TEXT LIST'
}

export enum FieldType {
    "text" = "text",
    "checkbox" = "checkbox",
    "color" = "color",
    "email" = "email",
    "image" = "image",
    "month" = "month",
    "number" = "number",
    "range" = "range",
    "tel" = "tel",
    "time" = "time",
    "url" = "url",
    "week" = "week",
    "date" = "date",
    "happy" = "happy",
    "list" = "list"
}

const fieldTypesArray = (): Array<String> => {
    const result = new Array<String>();
    for (let fieldType in FieldType) {
        const add = isNaN(parseInt(fieldType));
        if (add) {
            result.push(fieldType);
        }
    }
    return result;
}
export { fieldTypesArray };

export const LIST_AND_LISTS = 'listsAndLists';
export const CURRENT_SESSION = 'current';
export const FIELDS = 'fields';
export const NOTES = 'notes';
export const SEARCH_TEXT = 'searchText';
export const LIST_TITLE = 'title';
export const TIMESTAMP_SAVE = 'timestampSave';
export const DISPLAY_AT = 'displayAt';
export const REPEAT_PERIOD = 'repeatPeriod';
export const REPEAT_QTY = 'repeatQty';
export const TIMED_NOTES = 'timedNotes';
export const SEARCH_EVENT = 'searchEvent';
export const SAVE_SWITCH_EVENT = 'saveSwitchEvent';
export const SESSION_INDEX = -1;

export enum RepeatPeriod {
    None = "None",
    Days = "Days",
    Weeks = "Weeks",
    Months = "Months",
    Years = "Years"
}

export enum TimedNoteCommand {
    Add = "Add",
    Take = "Take",
    Amend = "Amend",
    List =  "List",
    Display = "Display",
    End = "End"
}

export const DEFAULT_STATE: StoredState = {
    lists: [] as Array<ListData>
}

export const DEFAULT_CURRENT: CurrentState = {
    listIndex: 0,
    sessionIndex: 0,
    searchText: "",
    unsaved: false
}

export const DEFAULT_SESSION: ListSession = {
    mark: makeMark(),
    note: null
}

export const DEFAULT_LIST: ListData = {
    listTitle: "",
    timestampSave: false,
    sessions: [DEFAULT_SESSION],
    displayAt: null,
    repeatPeriod: RepeatPeriod.None,
    repeatQty: 0
}

export type Note = Object | null;

export type CurrentState = {
    listIndex: number;
    sessionIndex: number;
    searchText: string;
    unsaved: boolean;
}

export type UpdateState = {
    current: CurrentState;
    stored: StoredState;
    ui: UIData;
    allowOverwrite: boolean;
}

export type StoredState = {
    lists: Array<ListData>
}
export type ListData = {
    listTitle: string,
    timestampSave: boolean,
    sessions: Array<ListSession>
    displayAt: string | null,
    repeatPeriod: RepeatPeriod,
    repeatQty: number
}

export type UIData = {
    listTitle: string,
    timestampSave: boolean,
    fields?: Array<Field>,
    note: Note,
    displayAt: string | null,
    repeatPeriod: RepeatPeriod,
    repeatQty: number
}

export type LocalData = {
    UIData: UIData,
    storedData: StoredState,
    current: CurrentState,

}


export type ListSession = {
    mark: string,
    fields?: Array<Field>,
    note: Note
}

export type Field = {
    id: number;
    fieldComponentType: FieldComponentType;
    fieldName: string;
    fieldType: FieldType;
    value: string;
    list?: Array<Field>;
    indent: number;
}

export type TimedNote = {
    time: string,
    id: string,
    repeatPeriod: RepeatPeriod,
    repeatQty: number
}

export type TimedNoteAction = {
    command: TimedNoteCommand,
    timedNote: TimedNote;
}

export type TimedNoteEvent = {
    command: TimedNoteCommand,
    list: Array<TimedNote>;
}

export type Matcher = (haystack: string) => boolean;
