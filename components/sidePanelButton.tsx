import Timers from "./timers";

type Props = {
    toggleSidePanel: Function
}

const SidePanelButton = (props: Props) => {

    return (
        <button className='float-left mr-2 ml-1 mt-2 mb-3 bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700 focus:outline-none focus:ring focus:ring-yellow-300  rounded-xl text-black pt-1 pb-1 pl-2 pr-2 ' onClick={(e) => props.toggleSidePanel()}>List</button>
    )
}

export default SidePanelButton;