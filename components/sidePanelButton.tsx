import Timers from "./timers";

type Props = {
    toggleSidePanel: Function
}

const SidePanelButton = (props: Props) => {

    return (
        <button className='float-left ml-1 mt-2 mb-3 bg-violet-500 hover:bg-violet-600 active:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-300 rounded-xl text-black p-3' onClick={(e) => props.toggleSidePanel()}>List</button>
    )
}

export default SidePanelButton;