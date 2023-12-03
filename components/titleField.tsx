import { CURRENT, DEFAULT_CURRENT, DEFAULT_STATE, LIST_AND_LISTS, LIST_TITLE } from "@/app/model";
import { search } from "@/utils/searchUtils";
import { useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";

const TitleField = () => {
    const [title, setTitle] = useLocalStorage(LIST_TITLE, '');
    const [current, _setCurrent] = useLocalStorage(CURRENT, DEFAULT_CURRENT);
    const [state, _setState] = useLocalStorage(LIST_AND_LISTS, DEFAULT_STATE);
    const [showDuplicateToast, setDuplicateToast] = useState(false);

    const changed = (title: string) => {
        const found = search(title, state.lists);
        if (!found) {
            setTitle(title);
            return;
        }
        if (current.listIndex == found.listIndex) {
            setTitle(title);
        } else if (state.lists[found.listIndex].listTitle == title){
            setDuplicateToast(true);
            setTimeout(() => setDuplicateToast(false), 5000);
        }
    }

    useEffect(() => {
        const field = document.getElementById('title-input') as HTMLInputElement;
        if (field) {
            field.value = title;
        }
    }, [title])


    return (
        <>
            <input id={'title-input'} defaultValue={title}
                onChange={(e) => changed(e.target.value)}
                className="text-black w-2/6 h-10 ps-2 pe-2 ml-3 mr-3 mt-3 mb-2" placeholder="Title"></input>
            {showDuplicateToast && <label className=" mr-1 ml-10 mt-2 mb-3 bg-red-200 rounded-xl text-black p-3 ">
                Duplicate List Title</label>}</>
    )
}

export default TitleField;


