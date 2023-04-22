import { FC } from "react";
import { Track } from "../app.interfaces";

interface SearchItemProps {
    item: Track;
    isLast: boolean;
    pickTrack: (track: Track) => void;
}

const SearchItem: FC<SearchItemProps> = ({ item, isLast, pickTrack }) => {
    return (
        <div className={"flex flex-row bg-input text-ifyl w-full border-t border-slate-400 cursor-pointer " + (isLast ? "rounded-b-2xl" : '')} onClick={()=>pickTrack(item)}>
            <img className="p-2" src={item.thumbnail} alt="" />
            <div className="flex flex-col gap-1 p-2">
                <span className="font-semibold">{item.name}</span>
                <span className="opacity-75">{item.artists}</span>
            </div>
        </div>
    );
};

export default SearchItem;
