import { FC } from "react";
import { Track } from "../app.interfaces";

interface TrackProps {
    track: Track;
}

const TrackComponent : FC<TrackProps> = ({ track }) => {
    function parseArtists() {
        if (track.artists.length > 30) {
            return track.artists.slice(0, 30).split(',').slice(0, -1).join(',') + '...';
        }
        return track.artists;
    }

    function parseTitle() {
        if (track.name.length > 23) {
            return track.name.slice(0, 23) + '...';
        }
        return track.name;
    }

    function openSpotify() {
        window.open(track.link, '_blank');
    }

    return (
        <div className="flex flex-col fade-in justify-center items-center gap-1 mt-8 2xl:w-72 xl:w-56">
            <div className="relative">
                <img  className="2xl:w-60 2xl:h-60 xl:w-36 xl:h-36 mb-3 "src={track.image} alt="" />
                <div className="flex justify-center items-center 2xl:w-60 2xl:h-60 xl:w-36 xl:h-36 absolute bg-gray top-0 cursor-pointer" onClick={openSpotify}>
                    <span className="flex gap-1">Reproducir en <p className="text-spotify font-semibold">Spotify</p></span>
                </div>
            </div>
            <span className="text-ifyl 2xl:text-xl xl:text-base font-semibold text-center">{parseTitle()}</span>
            <span className="text-ifyl 2xl:text-base xl:text-xs opacity-75">{parseArtists()}</span>
        </div>
    )
}

export default TrackComponent;