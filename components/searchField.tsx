import { CURRENT, CurrentState, DEFAULT_CURRENT, DEFAULT_STATE, DISPLAY_AT, FIELDS, Field, LIST_AND_LISTS, LIST_TITLE, REPEAT_PERIOD, REPEAT_QTY, TIMESTAMP_SAVE } from "@/app/model";
import { RepeatPeriod } from "@/types";
import { log } from "@/utils/logUtils";
import { SearchResults, search } from "@/utils/searchUtils";
import { useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";

const SearchField = () => {
    const [current, setCurrent] = useLocalStorage(CURRENT, DEFAULT_CURRENT);
    const [state, _setState] = useLocalStorage(LIST_AND_LISTS, DEFAULT_STATE);
    const [_listTitle, setListTitle] = useLocalStorage(LIST_TITLE,'');
    const [_timestampSave, setTimestampSave] = useLocalStorage(TIMESTAMP_SAVE, false);
    const [_fields, setFields] = useLocalStorage(FIELDS,[] as Array<Field>);
    const [_displayAt, setDisplayAt] = useLocalStorage(DISPLAY_AT, '');
    const [_repeatPeriod, setRepeatPeriod] = useLocalStorage(REPEAT_PERIOD, RepeatPeriod.None);
    const [_repeatQty, setRepeatQty] = useLocalStorage(REPEAT_QTY, 0);

    useEffect(()=>{
        const field = document.getElementById('search-input') as HTMLInputElement;
        if (current.searchText != field.value){
            log('searching for',field.value);
            setSearchText(current.searchText);
        } else {
            log('search text the same',field.value);
        }
    }, [current])
        
    const setSearchText = (text:string) => {
        if (!text) {
            return;
        }
        
        const found = search(text, state.lists);
        if (found) {
            const list = state.lists[found.listIndex];
            setCurrentState(found, text);
            return;
        }
        console.log('not found ', text);
    }

    const setCurrentState = (found:SearchResults, searchText: string) =>{

        const list = state.lists[found.listIndex];
        const session = list.sessions[found.sessionIndex];
        const listsFields = session.fields;
        setListTitle(list.listTitle);
        setTimestampSave(list.timestampSave);
        setFields(listsFields);
        setDisplayAt(list.displayAt || '');
        setRepeatPeriod(list.repeatPeriod);
        setRepeatQty(list.repeatQty);
        const newPlace:CurrentState = {
            listIndex: found.listIndex,
            sessionIndex: found.sessionIndex,
            searchText
        };
        setCurrent(newPlace);
    }

    const gone = () =>{
        setSearchText("");
        const field = document.getElementById('search-input') as HTMLInputElement;
        field.value = '';
    }

    return (

        <search className="grid grid-cols-[0fr,12fr]">
            <div className="mt-2">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-5 w-4">
                    <path
                        fillRule="evenodd"
                        d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                        clipRule="evenodd" />
                </svg>
            </div>
            <input id='search-input'  onBlur={gone} defaultValue={current.searchText} autoFocus onChange={(e) => setSearchText(e.target.value)} className='lg:ml-10 lg:w-10/12 sm:w-full h-10 ps-2 pe-2 rounded-lg' placeholder="Search"></input>
        </search>
    )
}

export default SearchField;


