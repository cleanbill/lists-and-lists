import { CURRENT_SESSION, DEFAULT_CURRENT, DEFAULT_STATE, LIST_AND_LISTS, ListSession, NOTES, Note } from '@/types';
import Select, { ActionMeta, SingleValue, PropsValue } from 'react-select';
import { useLocalStorage } from "usehooks-ts";


type SelectOption = {
    value: string;
    label: string;
}

const SessionPicker = () => {

    const [note, setNote] = useLocalStorage(NOTES, null as Note)
    const [current, setCurrent] = useLocalStorage(CURRENT_SESSION, DEFAULT_CURRENT);
    const [state, _setState] = useLocalStorage(LIST_AND_LISTS, DEFAULT_STATE);

    const handleChange = (sessions: Array<ListSession>, option: string) => {
        current.sessionIndex = parseInt(option);
        setCurrent(current);
        // Should this be here???
        const currentSession = sessions[current.sessionIndex];
        setNote(currentSession.note);
    };


    const extractOptions = (sessions: Array<ListSession>) => {
        if (!sessions) {
            return [];
        }
        const dtf = new Intl.DateTimeFormat('en-GB', {    dateStyle: 'full',
        timeStyle: 'long',timeZoneName: undefined});
        return sessions.map((session: ListSession, index: number) => {
            const label = dtf.format(new Date(session.mark));
            const option =
            {
                "value": "" + index,
                "label": label
            };
            return option;
        }) as Array<{ value: string, label: string }>
    }

    const options = extractOptions(state.lists[current.listIndex].sessions);

    const hasSessions = typeof state == undefined? false : state?.lists[current.listIndex]?.sessions?.length > 1;

    const onChange = (newValue: SingleValue<SelectOption>, actionMeta: ActionMeta<SelectOption>) =>{
        // Needs testing
        handleChange(state.lists[current.listIndex].sessions, newValue?.value ?  newValue?.value: "0");
    }

    const defaultValue = current.listIndex; //:PropsValue<SelectOption> = current.sessionIndex as PropsValue;

    return (
        <>
            {hasSessions &&
                <Select
                    name="Selecting a mark"
                    placeholder="Select a session"
                    className="text-black h-10 rounded-xl p-1 mt-3 mr-2"
                    isSearchable={true}
                    openMenuOnClick={true}
                    // ts-ignore
                    defaultValue={options[current.listIndex]}
                    onChange={onChange}
                    options={options}
                />
            }
        </>
    )
}

export default SessionPicker;