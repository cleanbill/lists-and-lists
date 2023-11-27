import Timers from "./timers";

type Props = {
    discard: Function
    toggleSidePanel: Function
}

const SidePanel = (props: Props) => {

    return (
        <div className="float-left mt-10 bg-amber-300 p-2">
            <button className='float-right mt-2 mb-3 bg-violet-500 hover:bg-violet-600 active:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-300  rounded-xl text-black h-8 p-1' onClick={(e) => props.toggleSidePanel()}>X</button>
            <Timers discard={() => props.discard()}></Timers>
        </div>
    )
}

export default SidePanel;