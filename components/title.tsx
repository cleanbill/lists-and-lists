import { GroupData } from "@/app/model";
import { useState, useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";

type Props = {
    onchange: Function
    value: string
}

const Title = (props: Props) => {

    const [groupDataIndex, setGroupDataIndex_] = useLocalStorage('groupDataIndex', 0);
    const [titleIndex, setTitleIndex_] = useLocalStorage('titleIndex', 0);
    const [groups, setGroups_] = useLocalStorage('groups', new Array<GroupData>());

    const [titleText, setTitleText] = useLocalStorage('title',"");

    useEffect(() => {
        const currentTitle = groups[groupDataIndex]?.titles[titleIndex];
        if (currentTitle) {
            setTitleText(currentTitle.titleName);
        }
    }, [titleIndex, groupDataIndex]);

    return (
            <input onChange={e => props.onchange(e.target.value)} id='title-input' defaultValue={titleText} className="text-black w-9/12 h-10 ps-2 pe-2 ml-3 mr-3 mt-3 mb-2" placeholder="Title"></input>
    )
}

export default Title;