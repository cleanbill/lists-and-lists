import { LIST_AND_LISTS, StoredState } from "@/types";
import { makeMark } from "./saveUtils";

export const importData = async (elementID = 'importData') => {
    const dir = document.getElementById(elementID) as any;
    dir?.click();
    const file = dir.files[0] as File;
    console.log('data is ', file);
    if (!file) {
        return;
    }
    const content = await file.text();
    localStorage.setItem(LIST_AND_LISTS, content);
    return content;
}


export const exportData = (list: StoredState) => {
    console.log('Exporting ', list);
    const fileName = 'lists-and-lists-' + makeMark(true) + '.json';
    const fileToSave = new Blob([JSON.stringify(list, null, 4)], {
        type: 'application/json'
    });

    const url = window.URL || window.webkitURL;
    const link = url.createObjectURL(fileToSave);
    const a = document.createElement("a");
    a.download = fileName;
    a.href = link;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}