// @ts-ignore
import { BlockNoteView, useBlockNote } from "@blocknote/react";
import "@blocknote/core/style.css";
import { useLocalStorage } from "usehooks-ts";
import { BlockNoteEditor } from "@blocknote/core";
import { CURRENT_SESSION, DEFAULT_CURRENT, NOTES, Note } from "@/types";
import { useState } from "react";

const Notes = () => {
    const [note, setNote] = useLocalStorage(NOTES, null as Note);
    const [current, setCurrent] = useLocalStorage(CURRENT_SESSION, DEFAULT_CURRENT);
    const [focus, setFocus] = useState(false);
    const onEditorContentChange = (editor: BlockNoteEditor) => {
        const block = editor.topLevelBlocks;
        current.unsaved = true;
        setCurrent(current);
        setNote(block);
    };
    const initialContent = note;
    const editor = useBlockNote({
        onEditorContentChange,
        // @ts-ignore
        initialContent

    });

    const focused = () => setFocus(true);

    const loseFocus = () => setFocus(false);

    return <BlockNoteView onBlur={loseFocus} onFocus={focused} className={focus ? "m-3 border border-black rounded" : "m-3"} editor={editor} />;
}

export default Notes;