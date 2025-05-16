import React, {useEffect, useState, useRef} from 'react';
import {useAuth} from "../context/AuthContext";
import axios from "axios";
import {useMutation} from "@tanstack/react-query";
import {toast} from "react-toastify";
import {BiPencil} from "react-icons/bi";
import {IoCameraOutline} from "react-icons/io5";
import { GoPeople, GoTrophy, GoX, GoCheck } from "react-icons/go";
import PieChartMotos from '../components/charts/PieChartMotos';
import CountUp from 'react-countup';

const updateUserInfo = async ({ guid, name, authToken }) => {
    const payload = {};

    if (guid !== undefined) payload.guid = guid;
    if (name !== undefined) payload.name = name;

    await axios.put(`${import.meta.env.VITE_SEEK_AND_STOCK_API_URL}/user`, payload, {
        withCredentials: true,
        headers: {
            Authorization: `Bearer ${authToken}`,
        },
    });
}

const Profile = () => {

    const { isUserAuthenticated, user, isUserLoading, authToken, updateUser, fetchUser } = useAuth();
    const guidInputRef = useRef(null);

    const [ guid, setGuid ] = useState('');
    const [ editedGuid, setEditedGuid ] = useState('');
    const [isEditingGuid, setIsEditingGuid] = useState(false);

    const [ name, setName ] = useState('');
    const [ editedName, setEditedName ] = useState('');
    const [isEditingName, setIsEditingName] = useState(false);

    const mutation = useMutation({
        mutationFn: updateUserInfo,
        onSuccess: (_, variables) => {
            if ('guid' in variables) setGuid(variables.guid);
            if ('name' in variables) setName(variables.name);
            setIsEditingGuid(false);
            setIsEditingName(false);
            fetchUser();
            toast.info("User information updated successfully.");
        },
        onError: (error) => {
            if (error.response?.status === 422) {
                const messages = error.response.data.errors;
                if (messages?.guid) toast.error(messages.guid[0]);
                else if (messages?.name) toast.error(messages.name[0]);
                else toast.error("Validation failed.");
            } else {
                toast.error("Error while updating user information.");
                console.error("Server error:", error);
            }
        }
    });


    useEffect(() => {
        if (user?.guid && !guid) {
            setGuid(user.guid);
            setEditedGuid(user.guid)
        };

        if ((user?.name === null || user?.name === undefined) && user?.discord_global_name) {
            setName(user.discord_global_name);
            setEditedName(user.discord_global_name);
        } else if (user?.name && name !== user.name) {
            setName(user.name);
            setEditedName(user.name);
        }
    }, [user, guid, name]);

    if(isUserLoading) return <h1>Chargement...</h1>;
    if(!isUserAuthenticated) return <h1>non connecté</h1>;

    const handleGuidCheck = () => {
        const trimmed = editedGuid.trim();

        if (trimmed === '') {
            setEditedGuid(guid);
            setIsEditingGuid(false);
            return;
        }

        if (trimmed !== user.guid) {
            mutation.mutate({ guid: trimmed, authToken });
        } else {
            setIsEditingGuid(false);
        }
    };

    const handleNameCheck = () => {
        let trimmed = editedName.trim();

        if (trimmed !== user.name) {
            mutation.mutate({ name: trimmed, authToken });
        } else {
            setIsEditingName(false);
        }
    };

    return (
        <>
            <section className='flex bg-slate-50 rounded-xl p-4'>
                <figure className="relative">
                    <img
                        src={`https://cdn.discordapp.com/avatars/${user.discord_id}/${user.discord_avatar}.png`}
                        alt="Avatar"
                        className={'w-24 sm:w-36 rounded-full'}
                    />
                    {/* <figcaption className="w-6 h-6 bg-white rounded-full absolute bottom-0 right-0 flex justify-center items-center sm:w-8 sm:h-8">
                        <IoCameraOutline className='text-xl'/>
                    </figcaption> */}
                </figure>

                <article className="ml-4 flex flex-col justify-around text-slate-700">
                    {
                        isEditingName ?
                            <div className='relative'>
                                <input
                                    type="text"
                                    readOnly={!isEditingName}
                                    value={editedName}
                                    onChange={(e) => setEditedName(e.target.value)}
                                    className={`
                                        text-2xl font-semibold bg-transparent focus:outline-none focus:ring-0 transition-colors duration-3000 w-[244px] pr-16 border-b
                                        ${isEditingName ? 'border-gray-300' : 'border-transparent'}
                                        sm:text-3xl
                                        `}
                                    disabled={mutation.isPending}
                                />
                                 <div className="absolute right-0 top-2 flex space-x-2">
                                    <GoCheck
                                    onClick={handleNameCheck}
                                    className="text-green-600 text-lg cursor-pointer hover:bg-green-50 transition-colors duration-300 sm:text-2xl"
                                    />
                                    <GoX
                                    onClick={() => {
                                        setIsEditingName(false);
                                        setEditedName(name);
                                    }}
                                    className="text-red-600 text-lg cursor-pointer hover:bg-red-50 transition-colors duration-300 sm:text-2xl"
                                    />
                                </div>
                            </div>

                        :
                        <div className='flex items-center'>
                            <p className='text-2xl font-semibold sm:text-3xl'>{name}</p>
                            <BiPencil onClick={() => setIsEditingName(true)}className="ml-2 text-lg cursor-pointer sm:text-2xl"/>
                        </div>
                    }

                    <div className={'flex items-center relative text-xs'}>
                        <label htmlFor="guid">GUID</label>
                        <input
                            onChange={(e) => setEditedGuid(e.target.value)}
                            type="text"
                            id="guid"
                            readOnly={!isEditingGuid}
                            value={editedGuid}
                            ref={guidInputRef}
                            className={`pr-16 pl-2 py-2 ml-2 rounded-md w-full ${guid ? 'bg-white' : 'bg-red-100'} focus:outline-none border-none ${!isEditingGuid ? 'cursor-default' : ''}`}
                            disabled={mutation.isPending}
                        />
                        {
                            isEditingGuid ?
                                <div className='absolute flex right-2 top-1/2 transform -translate-y-1/2 text-base space-x-2'>
                                    <GoCheck
                                        onClick={handleGuidCheck}
                                        className='text-green-600 cursor-pointer hover:bg-green-50 transition-colors duration-300 sm:text-lg'
                                    />
                                    <GoX
                                        onClick={() => {
                                            setIsEditingGuid(false);
                                            setEditedGuid(guid)
                                        }}
                                        className='text-red-600 cursor-pointer hover:bg-red-50 transition-colors duration-300 sm:text-lg'
                                    />
                                </div>
                            :
                                <BiPencil
                                    onClick={() => {
                                        setIsEditingGuid(true);
                                        setTimeout(() => {
                                            guidInputRef.current?.focus();
                                        }, 0);
                                    }}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-base cursor-pointer sm:text-lg"
                                />
                        }

                    </div>
                </article>
            </section>

            <section className='flex flex-col sm:flex-row sm:space-x-4'>
                <article className="w-full h-[100px] border-2 border-gray-200 rounded-xl mt-4 p-4 flex items-center">
                    <div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center'>
                        <GoTrophy className="text-red-600 w-8 h-8" />
                    </div>
                    <span className="text-2xl font-bold ml-3 sm:text-3xl">
                        <CountUp end={user.victory_count} duration={1.5} />
                    </span>
                    <p className="text-slate-700 ml-2 sm:text-lg">Victoires</p>
                </article>

                <article className="w-full h-[100px] border-2 border-gray-200 rounded-xl mt-4 p-4 flex items-center">
                    <div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center'>
                        <GoPeople className="text-red-600 w-8 h-8" />
                    </div>
                    <span className="text-2xl font-bold ml-3 sm:text-3xl">
                        <CountUp end={user.participation_count} duration={1.5} />
                    </span>
                    <p className="text-slate-700 ml-2">Participations</p>
                </article>
            </section>

            <section className='w-full border-2 border-gray-200 mt-4 rounded-xl p-4'>
                <h2 className="font-bold sm:text-lg">Bikes used</h2>
                {
                    user.bike_stats_by_category && Object.values(user.bike_stats_by_category).some(category => Object.keys(category).length > 0)
                    ? <PieChartMotos data={user.bike_stats_by_category} />
                    : <p className='text-center mt-4'>Your statistics will appear after entering a valid GUID and once the first lap times are recorded.</p>
                }

            </section>


        </>
    );
};

export default Profile;
