import React, { FC, useEffect, useState } from "react";
import Searchbar from "./components/Searchbar";
import { Track } from "./app.interfaces";
import TrackComponent from "./components/TrackComponent";
import { ApiService } from "./service/api.service";
import Switch from "react-switch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";

const App: FC = () => {
    const apiService = ApiService.getInstance();
    const lsTheme = localStorage.getItem("theme"); 

    const [pickedTrack, setPickedTrack] = useState<Track | null>(null);
    const [theme, setTheme] = useState<string>(lsTheme || 'light');
    const [recommendations, setRecommendations] = useState<Track[] | null>(
        null
    );
    const [loading, setLoading] = useState<boolean>(false);

    function changeTheme() {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem("darkMode", newTheme);
    }

    async function getRecommendations() {
        if (pickedTrack && !loading) {
            setRecommendations(null);
            setLoading(true);
            const recomms: Track[] = await apiService.recommend(pickedTrack.id);
            const toAdd: Track[] = [];
            const interval = setInterval(() => {
                if (!recomms.length) {
                    clearInterval(interval);
                    setLoading(false);
                    return;
                }
                toAdd.push(recomms.shift()!);
                setRecommendations([...toAdd]);
            }, 1000);
        }
        if (!pickedTrack) setRecommendations(null);
    }

    useEffect(() => {
        getRecommendations();
    }, [pickedTrack]);

    return (
        <div className={"App " + theme}>
            <div className="flex flex-row justify-between items-center mx-6 my-2">
                <div className="logo"></div>
                <Switch 
                    onChange={changeTheme} 
                    checked={theme === 'dark'}
                    checkedIcon={false}
                    uncheckedIcon={false}
                    checkedHandleIcon={<FontAwesomeIcon icon={faMoon} width={26} height={26}/>}
                    uncheckedHandleIcon={<FontAwesomeIcon icon={faSun} width={26} height={26}/>}
                    onColor="#E6E6FA"
                    offColor="#352c36"
                />
            </div>
            <div className="flex flex-col justify-center items-center">
                <Searchbar
                    pickedTrack={pickedTrack}
                    setPickedTrack={setPickedTrack}
                ></Searchbar>
                {pickedTrack && (
                    <TrackComponent track={pickedTrack}></TrackComponent>
                )}
                {recommendations && (
                    <div className="flex flex-col justify-start mt-2">
                        <div className="flex flex-row justify-between items-center px-[20px] w-full min-h-12">
                          <span className="text-ifyl text-left font-semibold text-2xl fade-in">You may like...</span>
                          {!loading && <button className="text-ifyl font-semibold 2xl:text-xl xl:text-lg fade-in bg-regen p-3 rounded-xl" onClick={() => getRecommendations()}>Re-generate</button>}
                        </div>
                        <div className="grid grid-cols-2 xl:grid-cols-5 justify-center items-center 2xl:gap-8 xl:gap-3 song-grid">
                            {recommendations
                                .map((track, i) => (
                                    <TrackComponent
                                        key={track?.id}
                                        track={track}
                                    ></TrackComponent>
                                ))
                                .concat(
                                    Array(5 - recommendations.length)
                                    .fill(0)
                                    .map((_, i) => (
                                        <div
                                            key={i}
                                            className="2xl:w-72 2xl:h-60 xl:w-56 w-40 xl:h-36 mb-3 rounded-2xl"
                                        ></div>
                                    ))
                                )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default App;
