"use client"
import { Field, FieldComponentType, FieldType, ListSession, DEFAULT_STATE, DEFAULT_LIST, DEFAULT_CURRENT, LIST_AND_LISTS, CURRENT, FIELDS, LIST_TITLE, TIMESTAMP_SAVE, CurrentState, DEFAULT_SESSION } from '@/app/model';
import { useLocalStorage } from 'usehooks-ts';
import Select from 'react-select';
import { useEffect, useState } from 'react';

const List = () => {

    const [state, _setState] = useLocalStorage(LIST_AND_LISTS, DEFAULT_STATE);
    const [current, setCurrent] = useLocalStorage(CURRENT, DEFAULT_CURRENT);

    const [fields, setFields] = useLocalStorage(FIELDS, DEFAULT_LIST.sessions[0].fields)
    const [listTitle, _setListTitle] = useLocalStorage(LIST_TITLE, "");
    const [timestampSave, setTimestampSave] = useLocalStorage(TIMESTAMP_SAVE, false);

    const [fieldIndex, setFieldIndex] = useState(-1);

    useEffect( () =>{
        setFieldIndex(-1);
    }, [fields])

    const add = (fieldType: string, index: number) => {
        const newField = {
            id: fields.length,
            fieldComponentType: FieldComponentType.ETL,
            fieldName: '',
            fieldType,
            value: '',
            indent: 0
        } as Field;
        if (fields.length == 0) {
            setFields([newField]);
            return;
        }
        if (fields.length - 1 == index) {
            setFields([...fields, newField]);
        } else {
            const fieldsBefore = fields.slice(0, index + 1);
            const fieldsAfter = fields.slice(index + 1);
            setFields([...fieldsBefore, newField, ...fieldsAfter].filter((f: Field) => f != null));
        }
        setFieldIndex(index + 1);
    }

    const switchTimeStampSave = (ev: any) => {
        const value: boolean = ev.target.checked;
        setTimestampSave(value);
    }

    const take = (index: number) => {
        setFields(fields.filter((_f: Field, i: number) => i != index));
    }

    const keyup = (e: React.KeyboardEvent<HTMLInputElement>, fieldType: string, index: number) => {
        if (e.key != 'Enter') {
            return;
        }
        if (index + 1 == fields.length) {
            add(fieldType, index);
        } else {
            setFieldIndex(index + 1);
            const id = 'general-input-' + (index + 1);
            const generalInput = document.getElementById(id);
            generalInput?.focus();
        }
    }

    const [handleChange] = useState(() => {
        return () => {
            setCurrent(current);
        };
    });

    const extractOptions = (sessions: Array<ListSession>) => {
        if (!sessions) {
            return [];
        }
        sessions.map((session: ListSession, index: number) => {
            const option =
            {
                "value": "" + index,
                "label": session.mark
            };
            return option;
        }) as Array<{ value: string, label: string }>
    }

    const update = (e: any, i: number) => {
        fields[i].value = e.target.value;
        setFields([...fields]);
    }

    const lastFieldIndex = fields.length || 0;

    return (
        <span>

            {state?.lists[current.listIndex]?.sessions?.length > 1 &&
                <Select
                    name="Selecting a mark"
                    placeholder="Select a session"
                    className='text-black'
                    isSearchable={true}
                    value={current.sessionIndex}
                    onChange={handleChange}
                    options={extractOptions(state.lists[current.listIndex].sessions)}
                />
            }
            <div>
                {fields.map((f: Field, index: number) => (
                                        // <ListRow key={f.id + index + ''} 
                                        // index={index} 
                                        // showTake={fields.length > 1} 
                                        // fieldType={f.fieldType} 
                                        // value={f.value} 
                                        // focus={index == fieldIndex} 
                                        // take={take} 
                                        // add={add} 
                                        // update={update} 
                                        // keyup={keyup}>
                                       
                                        // </ListRow>           
                    f != null && <span className="text-black" key={"span-" + f.id + index}>
                        {fields.length > 1 && <button onClick={() => take(index)} title='Delete' className="bg-red-400  hover:bg-red-600 active:bg-red-700 focus:outline-none focus:ring focus:ring-red-300 ps-0 ml-1 w-5 h-6 mr-1 rounded-lg text-sm ">D</button>}
                        
                        <button title='Do it tomorrow' className="bg-slate-500 ml-2 ps-0 w-5 h-6 mr-1 rounded-lg text-sm ">T</button>
                        
                        <button title='Indent' className="bg-slate-500 ml-2 ps-0 w-5 h-6 mr-1 rounded-lg text-sm ">+</button>
                        
                        {f.fieldType != FieldType.list && <input key={'quest-' + f.id + index} className="h-10 ps-2 pe-2 m-1 lg:w-4/12 rounded-md" placeholder="Question"></input>}
                        {f.fieldType != FieldType.list && <input key={'answ-' + f.id + index} className="h-10 ps-2 pe-2 m-1 lg:w-6/12 rounded-md" placeholder="Answer"></input>}
                        
                        {f.fieldType == FieldType.list && <input key={listTitle + '-input-' + f.id + index} onChange={(e) => update(e, index)} defaultValue={f.value} onKeyUp={(e) => keyup(e, f.fieldType, index)} autoFocus={index == fieldIndex} className="h-10 ps-2 pe-2 m-1 lg:w-10/12 rounded-md" placeholder="Answer"></input>}
                        
                        <button title='Switch Type' className=" ps-0 w-5 h-6 mr-1 rounded-lg text-sm ">...</button>
                        
                        <button onClick={() => add(f.fieldType, index)} title='Add field' className="bg-green-400 hover:bg-green-600 active:bg-green-700 focus:outline-none focus:ring focus:ring-green-300 ps-0 w-10 h-6 mr-1 rounded-lg text-sm ">ADD</button>
                        
                        <br></br>
                    </span>))}
            </div>
            {(fields.length == 0) && <button onClick={() => add(FieldType.list, lastFieldIndex)} title='Add field' className="bg-green-400 hover:bg-green-600 active:bg-green-700 focus:outline-none focus:ring focus:ring-green-300 ps-0 w-10 h-6 mr-1 rounded-lg text-sm ">ADD</button>}
            <span className='grid grid-cols-[10fr,1.5fr,1fr]'>
                <div></div>
                <label htmlFor='timestamp-switch' className='float-right text-black'>Timestamp save</label>
                <input onChange={switchTimeStampSave} value={timestampSave + ''} id='timestamp-switch' type="checkbox" className=" float-right text-black p-3"></input>
            </span>
        </span>
    )

}

export default List;