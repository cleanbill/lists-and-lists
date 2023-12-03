import { FieldType} from "@/app/model";

type Props = {
    id: string,
    index: number,
    showTake: boolean,
    fieldType: FieldType,
    value: string,
    focus: boolean,
    take: Function,
    add: Function,
    update: Function,
    keyup: Function
}

export const ListRow = (prop: Props) => {

    return (
        <span className="text-black" key={"span-" + prop.id}>
            {prop.showTake && <button key={'delete-' + prop.id}  onClick={() => prop.take(prop.index)} title='Delete' className="bg-red-400  hover:bg-red-600 active:bg-red-700 focus:outline-none focus:ring focus:ring-red-300 ps-0 ml-1 w-5 h-6 mr-1 rounded-lg text-sm ">D</button>}

            <button key={'tomorrow-' + prop.id} title='Do it tomorrow' className="bg-slate-500 ml-2 ps-0 w-5 h-6 mr-1 rounded-lg text-sm ">T</button>

            <button key={'indent-' + prop.id} title='Indent' className="bg-slate-500 ml-2 ps-0 w-5 h-6 mr-1 rounded-lg text-sm ">+</button>

            {prop.fieldType != FieldType.list && <input key={'quest-' + prop.id} className="h-10 ps-2 pe-2 m-1 lg:w-4/12 rounded-md" placeholder="Question"></input>}
            {prop.fieldType != FieldType.list && <input key={'answ-' + prop.id} className="h-10 ps-2 pe-2 m-1 lg:w-6/12 rounded-md" placeholder="Answer"></input>}

            {prop.fieldType == FieldType.list && <input key={'input-' + prop.id} onChange={(e) => prop.update(e, prop.index)} defaultValue={prop.value} id={'general-input-' + prop.id} onKeyUp={(e) => prop.keyup(e, prop.fieldType, prop.index)} autoFocus={prop.focus} className="h-10 ps-2 pe-2 m-1 lg:w-10/12 rounded-md" placeholder="Answer"></input>}

            <button key={'switch-' + prop.id} title='Switch Type' className=" ps-0 w-5 h-6 mr-1 rounded-lg text-sm ">...</button>

            <button key={'add-' + prop.id} onClick={() => prop.add(prop.fieldType, prop.index)} title='Add field' className="bg-green-400 hover:bg-green-600 active:bg-green-700 focus:outline-none focus:ring focus:ring-green-300 ps-0 w-10 h-6 mr-1 rounded-lg text-sm ">ADD</button>
            <br></br>
        </span>
    )
}

export default ListRow;