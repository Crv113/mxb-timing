import React from 'react';
import axios from "axios";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { GoPeople, GoTrophy } from "react-icons/go";
import PieChartMotos from '../components/charts/PieChartMotos';
import CountUp from 'react-countup';
import Loading from "../components/Loading";


const fetchUser = async (id) => {
    const { data } = await axios.get(`${import.meta.env.VITE_SEEK_AND_STOCK_API_URL}/users/${id}`, {
        headers: { Authorization: `Bearer ${import.meta.env.VITE_SEEK_AND_STOCK_API_TOKEN}` },
    });
    return data;
};

const PublicProfile = () => {
    const { id } = useParams();

    const { data: user, isLoading: isUserLoading, isError: isUserError } = useQuery({
        queryKey: ["user", id],
        queryFn: () => fetchUser(id),
    });

    if (isUserLoading) return <Loading>Loading ..</Loading>;
    if (isUserError) return <p>Failed to fetch data</p>;

    return (
        <>
            <section className='flex bg-slate-50 rounded-xl p-4'>
                <figure className="relative">
                    <img
                        src={`https://cdn.discordapp.com/avatars/${user.data.discord_id}/${user.data.discord_avatar}.png`}
                        alt="Avatar"
                        className={'w-24 sm:w-36 rounded-full'}
                        onError={(e) => {
                            e.target.src = "/default-avatar.png";
                        }}
                    />
                </figure>

                <article className="ml-4 flex flex-col text-slate-700">
                    <div className='flex items-center'>
                        <p className='text-2xl mt-4 font-semibold sm:text-3xl'>{user.data.name || user.data.discord_global_name}</p>
                    </div>

                    {/* <div className={'flex items-center relative text-xs'}>
                        <label htmlFor="guid">GUID</label>
                        <input
                            type="text"
                            id="guid"
                            readOnly={true}
                            value={user.data.guid}
                            className={`pr-16 pl-2 py-2 ml-2 rounded-md w-full focus:outline-none border-none`}
                        />
                    </div> */}
                </article>
            </section>

            <section className='flex flex-col sm:flex-row sm:space-x-4'>
                <article className="w-full h-[100px] border-2 border-gray-200 rounded-xl mt-4 p-4 flex items-center">
                    <div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center'>
                        <GoTrophy className="text-red-600 w-8 h-8" />
                    </div>
                    <span className="text-2xl font-bold ml-3 sm:text-3xl">
                        <CountUp end={user.data.victory_count} duration={1.5} />
                    </span>
                    <p className="text-slate-700 ml-2 sm:text-lg">Victoires</p>
                </article>

                <article className="w-full h-[100px] border-2 border-gray-200 rounded-xl mt-4 p-4 flex items-center">
                    <div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center'>
                        <GoPeople className="text-red-600 w-8 h-8" />
                    </div>
                    <span className="text-2xl font-bold ml-3 sm:text-3xl">
                        <CountUp end={user.data.participation_count} duration={1.5} />
                    </span>
                    <p className="text-slate-700 ml-2">Participations</p>
                </article>
            </section>

            <section className='w-full border-2 border-gray-200 mt-4 rounded-xl p-4'>
                <h2 className="font-bold sm:text-lg">Bikes used</h2>
                {
                    user.data.bike_stats_by_category && Object.values(user.data.bike_stats_by_category).some(category => Object.keys(category).length > 0)
                    ? <PieChartMotos data={user.data.bike_stats_by_category} />
                    : <p className='text-center mt-4'>Statistics will appear once the first lap times are recorded.</p>
                }

            </section>


        </>
    );
};

export default PublicProfile;
