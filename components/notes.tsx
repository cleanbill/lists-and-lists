// @ts-ignore
import { BlockNoteView, useBlockNote } from "@blocknote/react";
import "@blocknote/core/style.css";
import { NOTES, Note } from "@/app/model";
import { useLocalStorage } from "usehooks-ts";


const Notes = () => {
    const [note, setNote] = useLocalStorage(NOTES, null as Note)

    const onEditorContentChange = (editor: BlockNoteView) => {
        const block = editor.topLevelBlocks;
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