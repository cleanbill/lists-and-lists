import Timers from "./timers";

type Props = {
    discard: Function
    toggleSidePanel: Function
}

const SidePanel = (props: Props) => (<aside className="float-left mt-10 bg-amber-300 p-2">
    <button className='float-right  bg-violet-500 hover:bg-violet-600 active:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-300  rounded-xl text-yellow-800 mb-10 ml-2 h-7 pb-2 pt-0.5 pr-2 pl-2' onClick={(e) => props.toggleSidePanel()}>X</button>
    <Timers discard={props.discard}></Timers>
</aside>)


export default SidePanel;