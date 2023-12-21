import { CURRENT_SESSION, SEARCH_EVENT, CurrentState, DEFAULT_CURRENT, DEFAULT_STATE, DISPLAY_AT, FIELDS, Field, LIST_AND_LISTS, LIST_TITLE, NOTES, Note, REPEAT_PERIOD, REPEAT_QTY, RepeatPeriod, TIMESTAMP_SAVE } from "@/types";
import { log } from "@/utils/logUtils";
import { SearchResults, search } from "@/utils/searchUtils";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";

let listening = false;

const SearchField = () => {
    const [current, setCurrent] = useLocalStorage(CURRENT_SESSION, DEFAULT_CURRENT);
    const [state, _setState] = useLocalStorage(LIST_AND_LISTS, DEFAULT_STATE);
    const [_listTitle, setListTitle] = useLocalStorage(LIST_TITLE, '');
    const [_timestampSave, setTimestampSave] = useLocalStorage(TIMESTAMP_SAVE, false);
    const [_fields, setFields] = useLocalStorage(FIELDS, [] as Array<Field>);
    const [_note, setNote] = useLocalStorage(NOTES, null as Note);
    const [_displayAt, setDisplayAt] = useLocalStorage(DISPLAY_AT, '');
    const [_repeatPeriod, setRepeatPeriod] = useLocalStorage(REPEAT_PERIOD, RepeatPeriod.None);
    const [_repeatQty, setRepeatQty] = useLocalStorage(REPEAT_QTY, 0);

    const searchParams = useSearchParams();
    let title = searchParams.get('title');

    if (!listening) {
        listening = true;
        // @ts-ignore
        document.addEventListener(SEARCH_EVENT, (customEvent: CustomEvent) => {
            setSearchText(customEvent.detail);
            customEvent.preventDefault();
        });
    }

    useEffect(() => {
        const field = document.getElementById('search-input') as HTMLInputElement;
        if (current?.searchText != field.value) {
            log('searching for', field.value);
            setSearchText(field.value);
        } else {
            log('search text the same', current?.searchText);
        }
        if (title) {
            setSearchText(title);
            title = null;
        }
    }, [current?.searchText])

    const setSearchText = (text: string) => {
        if (!text) {
            return;
        }

        const found = search(text, state.lists);
        if (found) {
            setCurrentState(found, text);
            return;
        }
    }

    const setCurrentState = (found: SearchResults, searchText: string) => {

        const list = state.lists[found.listIndex];
        const session = list.sessions[found.sessionIndex];
        const listsFields = session.fields || [];
        setListTitle(list.listTitle);
        setTimestampSave(list.timestampSave);
        setNote(session.note)
        setFields(listsFields);
        setDisplayAt(list.displayAt || '');
        setRepeatPeriod(list.repeatPeriod);
        setRepeatQty(list.repeatQty);
        const newPlace: CurrentState = {
            listIndex: found.listIndex,
            sessionIndex: found.sessionIndex,
            searchText,
            unsaved: true
        };
        setCurrent(newPlace);
    }

    const gone = () => {
        setSearchText("");
        const field = document.getElementById('search-input') as HTMLInputElement;
        field.value = '';
    }

    return (<search className="grid grid-cols-[0fr,12fr] mr-2">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-5 ml-3 mr-0 mt-3 text-yellow-600">
            <path
                fillRule="evenodd"
                d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                clipRule="evenodd" />
        </svg>
        <input id='search-input' onBlur={gone} defaultValue={current?.searchText} autoFocus onChange={(e) => setSearchText(e.target.value)} className='ml-7 h-10 ps-2 pe-2 mt-1 rounded-lg' placeholder="Search"></input></search>
    )
}

export default SearchField;
