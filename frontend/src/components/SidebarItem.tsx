
import { ReactElement } from "react";

export function  Sidebaritem({text,icon}:{
    text:string;
    icon:ReactElement;
}){
    return<div className="flex text-gray-700 py-2 cursor-pointer
    hover:bg-gray-200 rounded max-w-48 pl-4">
        {icon}{text}
    </div>

}