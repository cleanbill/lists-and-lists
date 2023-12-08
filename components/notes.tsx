// @ts-ignore
import { BlockNoteView, useBlockNote } from "@blocknote/react";
import "@blocknote/core/style.css";
import { CURRENT, DEFAULT_CURRENT, NOTES, Note } from "@/app/model";
import { useLocalStorage } from "usehooks-ts";


const Notes = () => {
    const [note, setNote] = useLocalStorage(NOTES, null as Note)
    const [current, setCurrent] = useLocalStorage(CURRENT, DEFAULT_CURRENT);

    const onEditorContentChange = (editor: BlockNoteView) => {
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

    return <BlockNoteView className="m-3" editor={editor} />;
}

export default Notes;