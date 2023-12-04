import { FieldType } from "@/app/model";

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
        <p className="text-black w-full grid grid-cols-[1fr,10fr,0.5fr]" key={"para-" + prop.id}>
            <div className="mt-2" key={"dti-" + prop.id}>
                {prop.showTake && <button key={'delete-' + prop.id} onClick={() => prop.take(prop.index)} title='Delete' className="bg-red-400  hover:bg-red-600 active:bg-red-700 focus:outline-none focus:ring focus:ring-red-300 ps-0 ml-1 w-5 h-6 mr-1 rounded-lg text-sm ">D</button>}

                <button key={'tomorrow-' + prop.id} title='Do it tomorrow' className="bg-amber-500 ml-2 ps-0 w-5 h-6 mr-1 rounded-lg text-sm ">T</button>

                <button key={'indent-' + prop.id} title='Indent' className="bg-amber-500 ml-2 ps-0 w-5 h-6 mr-1 rounded-lg text-sm ">»</button>
            </div>

            <div key={'inputs-' + prop.id}>
                {prop.fieldType != FieldType.list && <input key={'quest-' + prop.id} className="h-10 ps-2 pe-2 m-1 lg:w-4/12 rounded-md" placeholder="Question"></input>}
                {prop.fieldType != FieldType.list && <input key={'answ-' + prop.id} className="h-10 ps-2 pe-2 m-1 lg:w-6/12 rounded-md" placeholder="Answer"></input>}

                {prop.fieldType == FieldType.list && <input key={'input-' + prop.id} onChange={(e) => prop.update(e, prop.index)} defaultValue={prop.value} id={'general-input-' + prop.index} onKeyUp={(e) => prop.keyup(e, prop.fieldType, prop.index)} autoFocus={prop.focus} className="h-10 ps-1 pe-2 m-1 w-full rounded-md" placeholder="Answer"></input>}
            </div>

            <div className="mt-5" key={"ta-" + prop.id}>
                <button key={'switch-' + prop.id} title='Switch Type' className=" ps-0 w-5 h-6 mr-1 rounded-lg text-sm ">...</button>

                <button key={'add-' + prop.id} onClick={() => prop.add(prop.fieldType, prop.index)} title='Add field' className="bg-amber-400 hover:bg-amber-600 active:bg-amber-700 focus:outline-none focus:ring focus:ring-amber-300 ps-0 w-4 h-5 mr-1 rounded-lg text-sm ">+</button>
                <br></br>
            </div>
        </p>
    )
}

export default ListRow;