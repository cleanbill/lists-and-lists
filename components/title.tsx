import { useLocalStorage } from "usehooks-ts";

const Title = () => {

    const [title, _setTitle] = useLocalStorage('title',"");

    return (
            <input id='title-input' defaultValue={title} className="text-black w-9/12 h-10 ps-2 pe-2 ml-3 mr-3 mt-3 mb-2" placeholder="Title"></input>
    )
}

export default Title;