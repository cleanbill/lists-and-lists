import { DEFAULT_STATE, LIST_AND_LISTS } from "@/types";
import { importData, exportData } from "@/utils/backupUtils";
import { useLocalStorage } from "usehooks-ts";

const Foot = () => {

    const [state, _setState] = useLocalStorage(LIST_AND_LISTS, DEFAULT_STATE);


    return (
        <footer className="pt-4 w-full  bg-white max-w rounded-lg shadow md:flex md:items-center md:justify-between md:p-6 dark:bg-gray-800 static bottom-0 mt-96">

            <div className=" grid grid-cols-2 w-100 gap-10 h-full">

                <button onClick={() => importData()} title="Import to local storage" className="butt sg:mb-4 justify-self-start ml-3 hover:underline hover:bg-yellow-100 active:bg-yellow-100 focus:ring focus:ring-yellow-300">Import</button>
                <input type="file" hidden
                    id="importData" name="importData"
                    accept="application/json" onChange={() => importData()} />
                <button onClick={() => exportData(state)} title="Export from local storage" className="butt sg:mb-4 justify-self-end hover:underline hover:bg-yellow-100 active:bg-yellow-100 focus:ring focus:ring-yellow-300">Export</button>
            </div>

            <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2024 <a href="https://github.com/cleanbill/lists-and-lists" className="hover:underline">Lists and lists™</a>. All Rights Reserved.
            </span>
            <ul className="flex flex-wrap items-center mt-3 text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
                <li>
                    <a href="#" className="mr-4 hover:underline md:mr-6 ">About</a>
                </li>
                <li>
                    <a href="#" className="mr-4 hover:underline md:mr-6">Privacy Policy</a>
                </li>
                <li>
                    <a href="#" className="mr-4 hover:underline md:mr-6">Licensing</a>
                </li>
                <li>
                    <a href="#" className="hover:underline">Contact</a>
                </li>
            </ul>
        </footer>
    )

}

export default Foot;