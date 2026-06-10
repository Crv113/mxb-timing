import React, { useEffect } from 'react';
import BestLapTimesByTrackTable from '../components/BestLapTimesByTrackTable';
import PieChartMotos from '../components/charts/PieChartMotos';
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { GoPeople, GoTrophy } from "react-icons/go";
import { BiRefresh } from "react-icons/bi";
import CountUp from 'react-countup';
import Loading from "../components/Loading";

const fetchPlayer = async (id) => {
    const { data } = await axios.get(`${import.meta.env.VITE_SEEK_AND_STOCK_API_URL}/players/${id}`, {
        headers: { Authorization: `Bearer ${import.meta.env.VITE_SEEK_AND_STOCK_API_TOKEN}` },
    });
    return data;
};

const AnonymousProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data, isLoading, isError } = useQuery({
        queryKey: ["player", id],
        queryFn: () => fetchPlayer(id),
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
                <figure className="relative">
                    <img
                        src="/default-avatar.png"
                        alt="Avatar"
                        className={'w-24 sm:w-36 rounded-full'}
                    />
                </figure>

                <article className="ml-4 flex flex-col text-slate-700">
                    <p className='text-2xl mt-4 font-semibold sm:text-3xl'>{player?.player_name}</p>
                    <div className='flex items-center gap-1 mt-1 text-xs text-gray-500 border border-gray-200 rounded-full px-2 py-1 w-fit'>
                        <BiRefresh className="w-4 h-4" />
                        <span>Auto-registered account</span>
                    </div>
                </article>
            </section>

            <section className='flex flex-col sm:flex-row sm:space-x-4'>
                <article className="w-full h-[100px] border-2 border-gray-200 rounded-xl mt-4 p-4 flex items-center">
                    <div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center'>
                        <GoTrophy className="text-red-600 w-8 h-8" />
                    </div>
                    <span className="text-2xl font-bold ml-3 sm:text-3xl">
                        <CountUp end={player?.victory_count ?? 0} duration={1.5} />
                    </span>
                    <p className="text-slate-700 ml-2 sm:text-lg">Victories</p>
                </article>

                <article className="w-full h-[100px] border-2 border-gray-200 rounded-xl mt-4 p-4 flex items-center">
                    <div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center'>
                        <GoPeople className="text-red-600 w-8 h-8" />
                    </div>
                    <span className="text-2xl font-bold ml-3 sm:text-3xl">
                        <CountUp end={player?.participation_count ?? 0} duration={1.5} />
                    </span>
                    <p className="text-slate-700 ml-2">Participations</p>
                </article>
            </section>

            <section className='w-full border-2 border-gray-200 mt-4 rounded-xl p-4'>
                <h2 className="font-bold sm:text-lg">Best lap times</h2>
                {player?.best_lap_times_by_track?.length > 0
                    ? <BestLapTimesByTrackTable lapTimes={player.best_lap_times_by_track} />
                    : <p className='text-center mt-4'>No lap times yet.</p>
                }
            </section>

            <section className='w-full border-2 border-gray-200 mt-4 rounded-xl p-4'>
                <h2 className="font-bold sm:text-lg">Bikes used</h2>
                {player?.bike_stats_by_category && Object.values(player.bike_stats_by_category).some(category => Object.keys(category).length > 0)
                    ? <PieChartMotos data={player.bike_stats_by_category} />
                    : <p className='text-center mt-4'>Statistics will appear once the first lap times are recorded.</p>
                }
            </section>
        </>
    );
};

export default AnonymousProfile;
