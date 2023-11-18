"use client"
import { Field, FieldComponentType, FieldType, GroupData, Session, TitleData } from '@/app/model';
import { useEffect, useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { search } from '../utils/searchUtils'
import Select from 'react-select';
import { RepeatPeriod, TimedNote } from '@/types';

export type ListProps = {
    title: string,
    updateTitle: Function
    addTimedNote: Function
}

const convert = (oldSessions: any): Array<Session> => Object.keys(oldSessions).map(key => oldSessions[key]);

const List = (props: ListProps) => {

    const [searchText, _setSearchText] = useLocalStorage('searchText', '');

    const [groups, setGroups] = useLocalStorage('groups', new Array<GroupData>());
    const [groupDataIndex, setGroupDataIndex] = useLocalStorage('groupDataIndex', 0);
    const [titleIndex, setTitleIndex] = useLocalStorage('titleIndex', 0);
    const [sessions, setSessions] = useState([] as Array<Session>);
    const [sessionIndex, setSessionIndex] = useLocalStorage('sessionIndex', 0);
    const [fieldIndex, setFieldIndex] = useState(0);
    const [repeatPeriod, _setRepeatPeriod_] = useLocalStorage('repeatPeriod', RepeatPeriod.None);
    const [repeatQty, _setRepeatQty] = useLocalStorage('repeatQty', 0);
    const [displayAt, _setDisplayAt] = useLocalStorage('displayAt', "");
    const [timestampSave, setTimestampSave] = useLocalStorage('timestampSave', false);

    useEffect(() => {
        const found = search(searchText, groups);
        if (found) {
            setCurrentState(found);
            return;
        }
        console.log('not found ', searchText);
        props.updateTitle('');
    }, [searchText, groupDataIndex, titleIndex, props.title])

    const reindex = (fields: Array<Field>): Array<Field> => {
        return fields.filter((f: Field) => f != null)
            .map((f: Field, i: number) => {
                f.id = i + 1;
                return f;
            });
    }

    const setCurrentState = (found: { groupDataIndex: number; titleIndex: number }) => {
        setGroupDataIndex(found.groupDataIndex);
        setTitleIndex(found.titleIndex);
        setFieldIndex(-1);
        const title = groups[found.groupDataIndex].titles[found.titleIndex];
        const sessions = Array.isArray(title.sessions) ? title.sessions : convert(title.sessions).filter((s: Session) => s.mark.trim().length > 0);
        setSessions([...sessions]);
        setSessionIndex(sessions.length - 1);
        props.updateTitle(title.titleName);
    }

    const getFields = (): Array<Field> => {
        if (!sessions[sessionIndex]) {
            sessions[sessionIndex] = {
                no: sessionIndex,
                group: '',
                title: props.title,
                mark: '',
                fields: Array<Field>()
            }
            return [] as Array<Field>;
        }
        return sessions[sessionIndex].fields;
    }

    const add = (fieldType: string, index: number) => {
        const fields = getFields();
        const newField = {
            id: fields.length,
            fieldComponentType: FieldComponentType.ETL,
            fieldName: '',
            fieldType,
            value: '',
            indent: 0
        } as Field;
        if (fields.length - 1 == index) {
            sessions[sessionIndex].fields = [...fields, newField];
        } else {
            const fieldsBefore = fields.slice(0, index + 1);
            const fieldsAfter = fields.slice(index + 1);
            sessions[sessionIndex].fields = [...fieldsBefore, newField, ...fieldsAfter].filter((f: Field) => f != null);
        }
        setFieldIndex(index + 1);
        setSessions([...sessions]);
    }

    const switchTimeStampSave = (ev: any) => {
        const value: boolean = ev.target.checked;
        setTimestampSave(value);
    }

    const take = (index: number) => {
        const fields = sessions[sessionIndex].fields.filter((f_: Field, i: number) => i != index);
        sessions[sessionIndex].fields = fields;
        setSessions([...sessions]);
    }

    const keyup = (e: React.KeyboardEvent<HTMLInputElement>, fieldType: string, index: number) => {
        if (e.key != 'Enter') {
            return;
        }
        if (index + 1 == sessions[sessionIndex]?.fields.length) {
            add(fieldType, index);
        } else {
            setFieldIndex(index + 1);
            const id = 'general-input-' + (index + 1);
            const generalInput = document.getElementById(id);
            generalInput?.focus();
        }
    }

    const createDefault = () => {
        groups[groupDataIndex] = {
            groupName: 'Main',
            titles: new Array<TitleData>(),
            display: true
        }
        groups[groupDataIndex].titles = [
            {
                titleName: props.title,
                timestampSave,
                sessions: new Array<Session>(),
                displayAt,
                repeatPeriod,
                repeatQty,
            }
        ]
    }


    const z = (n: number) => n < 10 ? "0" + n : n + "";

    const makeMark = (includeMinutes = false) => {
        const now = new Date();
        const minutes = includeMinutes ? z(now.getMinutes()) : '00';
        const mark = now.getFullYear() + "-" + z(now.getMonth() + 1) + "-" + z(now.getDate()) + ":" + z(now.getHours()) + ':' + minutes;
        return mark;
    }

    const changeTitle = () => {
        const currentSession = groups[groupDataIndex].titles[titleIndex].sessions[sessionIndex];
        currentSession.title = props.title;
        currentSession.mark = makeMark();
        const found = search(props.title, groups);
        if (found) {
            console.log('switched title to ', props.title);
            setCurrentState(found);
            groups[groupDataIndex].titles[titleIndex].sessions = [currentSession];
            return;
        } else {
            props.updateTitle('');
        }
        groups[groupDataIndex].titles.push(
            {
                titleName: props.title,
                timestampSave,
                sessions: new Array<Session>(),
                displayAt,
                repeatPeriod,
                repeatQty
            }
        );

    }

    const updateSession = () => {
        const titleData = groups[groupDataIndex].titles[titleIndex];
        titleData.displayAt = displayAt;
        titleData.repeatPeriod = repeatPeriod;
        titleData.repeatQty = repeatQty;
        if (timestampSave) {
            const newSession = { ...titleData.sessions[sessionIndex] };
            newSession.no = newSession.no + 1;
            newSession.mark = makeMark();
            titleData.sessions.push(newSession);
        } else {
            titleData.sessions = sessions;
        }
        titleData.titleName = props.title;
        groups[groupDataIndex].titles[titleIndex] = titleData;
    }

    const save = () => {
        if (!groups[groupDataIndex]) {
            createDefault();
        } else if (sessions[sessionIndex].title != props.title) {
            changeTitle();
        } else {
            updateSession();
        }
        setGroups([...groups]);
        const timedNote: TimedNote = {
            time: displayAt,
            id: props.title,
            repeatPeriod,
            repeatQty
        }
        props.addTimedNote(timedNote);
    }

    const [handleChange] = useState(() => {
        return () => {
            setSessionIndex(sessionIndex);
        };
    });

    const extractOptions = (sessions: Array<Session>) =>{ 
        if (!sessions){
            return [];
        }
        sessions.map((session: Session, index: number) => {
        const option =
        {
            "value": "" + index,
            "label": session.mark
        };
        return option;
    }) as Array<{ value: string, label: string }>}

    const update = (e: any, i: number) => {
        sessions[sessionIndex].fields[i].value = e.target.value;
    }

    const lastFieldIndex = sessions[sessionIndex]?.fields.length || 0;

    return (
        <span>

            {sessions?.length > 1 &&
                <Select
                    name="Selecting a mark"
                    placeholder="Select a session"
                    className='text-black'
                    isSearchable={true}
                    value={sessionIndex}
                    onChange={handleChange}
                    options={extractOptions(sessions)} // ts-ignore
                />
            }
            <div>
                {sessions[sessionIndex]?.fields.map((f: Field, index: number) => (
                    f != null && <span className="text-black" key={"span-" + f.id + index}>
                        {sessions[sessionIndex]?.fields.length > 1 && <button onClick={() => take(index)} title='Delete' className="bg-red-400  hover:bg-red-600 active:bg-red-700 focus:outline-none focus:ring focus:ring-red-300 ps-0 ml-1 w-5 h-6 mr-1 rounded-lg text-sm ">D</button>}
                        <button title='Do it tomorrow' className="bg-slate-500 ml-2 ps-0 w-5 h-6 mr-1 rounded-lg text-sm ">T</button>
                        <button title='Indent' className="bg-slate-500 ml-2 ps-0 w-5 h-6 mr-1 rounded-lg text-sm ">+</button>
                        {f.fieldType != 'list' && <input key={'quest-' + f.id + index} className="h-10 ps-2 pe-2 m-1 lg:w-4/12 rounded-md" placeholder="Question"></input>}
                        {f.fieldType != 'list' && <input key={'answ-' + f.id + index} className="h-10 ps-2 pe-2 m-1 lg:w-6/12 rounded-md" placeholder="Answer"></input>}
                        {f.fieldType == 'list' && <input key={props.title + '-input-' + f.id + index} onChange={(e) => update(e, index)} defaultValue={f.value} id={'general-input-' + index} onKeyUp={(e) => keyup(e, f.fieldType, index)} autoFocus={index == fieldIndex} className="h-10 ps-2 pe-2 m-1 lg:w-10/12 rounded-md" placeholder="Answer"></input>}
                        <button title='Switch Type' className=" ps-0 w-5 h-6 mr-1 rounded-lg text-sm ">...</button>
                        <button onClick={() => add(f.fieldType, index)} title='Add field' className="bg-green-400 hover:bg-green-600 active:bg-green-700 focus:outline-none focus:ring focus:ring-green-300 ps-0 w-10 h-6 mr-1 rounded-lg text-sm ">ADD</button>
                        <br></br>
                    </span>))}
            </div>
            {(!sessions[sessionIndex] || sessions[sessionIndex]?.fields.length == 0) && <button onClick={() => add(FieldType.list, lastFieldIndex)} title='Add field' className="bg-green-400 hover:bg-green-600 active:bg-green-700 focus:outline-none focus:ring focus:ring-green-300 ps-0 w-10 h-6 mr-1 rounded-lg text-sm ">ADD</button>}
            <span className='grid grid-cols-[10fr,1.5fr,1fr]'>
                <div></div>
                <label htmlFor='timestamp-switch' className='float-right text-black'>Timestamp save</label>
                <input onChange={switchTimeStampSave} value={timestampSave + ''} id='timestamp-switch' type="checkbox" className=" float-right text-black p-3"></input>
            </span>
            <button onClick={() => save()} className="float-right mr-1 ml-10 mt-2 mb-3 bg-violet-500 hover:bg-violet-600 active:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-300  rounded-xl text-black p-3 ">Save</button>

        </span>
    )

}

export default List;