import React, { FC, useEffect, useState } from "react";
import Searchbar from "./components/Searchbar";
import { Track } from "./app.interfaces";
import TrackComponent from "./components/TrackComponent";
import { ApiService } from "./service/api.service";

const App: FC = () => {
    const apiService = ApiService.getInstance();
    const [pickedTrack, setPickedTrack] = useState<Track | null>(null);
    const [recommendations, setRecommendations] = useState<Track[] | null>(
        null
    );
    const [loading, setLoading] = useState<boolean>(false);

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
    }

    useEffect(() => {
        getRecommendations();
    }, [pickedTrack]);

    return (
        <div className="App dark">
            <div className="logo"></div>
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
                        <div className="flex flex-row justify-center items-center 2xl:gap-8 xl:gap-3">
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
                                                className="2xl:w-72 2xl:h-60 xl:w-56 xl:h-36 mb-3 rounded-2xl"
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
