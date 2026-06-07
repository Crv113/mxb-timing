import React, { useEffect } from 'react';
import BestLapTimesByTrackTable from '../components/BestLapTimesByTrackTable';
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Loading from "../components/Loading";

const fetchPlayer = async (guid) => {
    const { data } = await axios.get(`${import.meta.env.VITE_SEEK_AND_STOCK_API_URL}/players/${guid}`, {
        headers: { Authorization: `Bearer ${import.meta.env.VITE_SEEK_AND_STOCK_API_TOKEN}` },
    });
    return data;
};

const AnonymousProfile = () => {
    const { guid } = useParams();
    const navigate = useNavigate();

    const { data, isLoading, isError } = useQuery({
        queryKey: ["player", guid],
        queryFn: () => fetchPlayer(guid),
    });

    useEffect(() => {
        if (data?.data?.user_id) {
            navigate(`/profile/${data.data.user_id}`, { replace: true });
        }
    }, [data, navigate]);

    if (isLoading) return <Loading>Loading ..</Loading>;
    if (isError) return <p>Failed to fetch data</p>;
    if (data?.data?.user_id) return null;

    const player = data?.data;

    return (
        <>
            <section className='flex bg-slate-50 rounded-xl p-4'>
                <article className="flex flex-col text-slate-700">
                    <p className='text-2xl font-semibold sm:text-3xl'>{player?.player_name}</p>
                    <p className='text-xs text-gray-400 mt-1'>Anonymous player</p>
                </article>
            </section>

            <section className='w-full border-2 border-gray-200 mt-4 rounded-xl p-4'>
                <h2 className="font-bold sm:text-lg">Best lap times</h2>
                {player?.best_lap_times_by_track?.length > 0
                    ? <BestLapTimesByTrackTable lapTimes={player.best_lap_times_by_track} />
                    : <p className='text-center mt-4'>No lap times yet.</p>
                }
            </section>
        </>
    );
};

export default AnonymousProfile;
