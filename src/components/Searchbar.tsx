import { FC, useEffect, useState } from "react";
import { ApiService } from "../service/api.service";
import { Track } from "../app.interfaces";
import SearchItem from "./SearchItem";

interface SearchBarProps {
    pickedTrack: Track | null;
    setPickedTrack: (track: Track | null) => void;
}

const Searchbar: FC<SearchBarProps> = ({ pickedTrack, setPickedTrack }) => {
    const [search, setSearch] = useState<string>("");
    const [tracks, setTracks] = useState<Track[]>([]);
    // const [pickedTrack, setPickedTrack] = useState<Track | null>(null);
    const apiService = ApiService.getInstance();

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setSearch(e.target.value);
    }

    async function pickTrack (track: Track) {
        setTracks([]);
        setPickedTrack(track);
        setSearch(track.name);
    }

    useEffect(() => {
        const timeoutId = setTimeout(async () => {
            let tPT = !!(pickedTrack)
            if (pickedTrack && search !== pickedTrack.name) {
                setPickedTrack(null);
                tPT = false;
            }
            if (search.length && !tPT) {
                const tracks: Track[] = await apiService.search(search);
                setTracks(tracks);
            } else setTracks([]);
            
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [search, pickedTrack]);

    return (
        <div className="flex flex-col justify-center items-center gap-3 w-1/2">
            <span className="text-ifyl text-left w-full font-semibold text-2xl">
                If you liked...
            </span>
            <div className="relative w-full">
                <input
                    className={"w-full relative p-4 outline-0 bg-input text-ifyl" + (tracks.length ? " rounded-t-2xl" : " rounded-2xl")}
                    value={search}
                    onChange={handleChange}
                    type="text"
                    placeholder="Search for a song..."
                />
                <div className="absolute w-full">
                    {tracks.map((track, i) => <SearchItem key={track.id} pickTrack={pickTrack} item={track} isLast={i === tracks.length-1}/>)}
                </div>
            </div>
        </div>
    );
};

export default Searchbar;
