import { LIST_TITLE } from "@/app/model";
import { useLocalStorage } from "usehooks-ts";

const TitleField = () => {
    const [title, setTitle] = useLocalStorage(LIST_TITLE,'');
    const field = document.getElementById('title-input') as HTMLInputElement;
    if (field){
        field.value = title;
    }

    return (
        <input id={'title-input'} defaultValue={title} onChange={(e) => setTitle(e.target.value)} className="text-black w-9/12 h-10 ps-2 pe-2 ml-3 mr-3 mt-3 mb-2" placeholder="Title"></input>
    )
}

export default TitleField;


