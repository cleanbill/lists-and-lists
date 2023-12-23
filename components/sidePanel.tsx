import Timeless from "./timeless";
import Timers from "./timers";

type Props = {
    discard: Function
    toggleSidePanel: Function
}



const SidePanel = (props: Props) => (<aside className="float-left mt-2 text-yellow-600 bg-amber-300 p-2 rounded-xl ml-1 mb-1">
    <span className="grid grid-cols-[11fr,1fr] h-7">
        <h1>UPCOMING LIST</h1>
        <button className='float-right  bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700 focus:outline-none focus:ring focus:ring-yellow-300 text-xs rounded-xl text-yellow-800 mb-10 ml-0 mr-0 h-5 pb-2 pt-0.5 pr-1 pl-1 ' onClick={(e) => props.toggleSidePanel()}>X</button>
    </span>
    <Timers discard={props.discard}></Timers>
    <Timeless ></Timeless>
</aside>)


export default SidePanel;