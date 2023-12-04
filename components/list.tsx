"use client"
import { Field, FieldComponentType, FieldType, ListSession, DEFAULT_STATE, DEFAULT_LIST, DEFAULT_CURRENT, LIST_AND_LISTS, CURRENT, FIELDS, LIST_TITLE, TIMESTAMP_SAVE, CurrentState, DEFAULT_SESSION } from '@/app/model';
import { useLocalStorage } from 'usehooks-ts';
import Select from 'react-select';
import { useEffect, useState } from 'react';
import ListRow from './listRow';

const List = () => {

    const [state, _setState] = useLocalStorage(LIST_AND_LISTS, DEFAULT_STATE);
    const [current, setCurrent] = useLocalStorage(CURRENT, DEFAULT_CURRENT);

    const [fields, setFields] = useLocalStorage(FIELDS, DEFAULT_LIST.sessions[0].fields)
    const [listTitle, _setListTitle] = useLocalStorage(LIST_TITLE, "");

    const [fieldIndex, setFieldIndex] = useState(-1);

    useEffect(() => {
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

    const take = (index: number) => {
        const newFields = fields.filter((_f: Field, i: number) => i != index);
        setFields([...newFields]);
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
        setFieldIndex(i);
    }

    const lastFieldIndex = fields.length || 0;

    return (
        <div>

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
            {fields.map((f: Field, index: number) => (
                <ListRow
                    key={listTitle + '-' + index + '-' + f.value + '-' + f.id}
                    id={listTitle + '-' + index + '-' + f.value + '-' + f.id}
                    index={index}
                    showTake={fields.length > 1}
                    fieldType={f.fieldType}
                    value={f.value}
                    focus={index == fieldIndex}
                    take={take}
                    add={add}
                    update={update}
                    keyup={keyup}></ListRow>

            ))}
            {(fields.length == 0) && <button onClick={() => add(FieldType.list, lastFieldIndex)} title='Add field' className="bg-green-400 hover:bg-green-600 active:bg-green-700 focus:outline-none focus:ring focus:ring-green-300 ps-0 w-10 h-6 mr-1 rounded-lg text-sm ">ADD</button>}
        </div>
    )

}

export default List;