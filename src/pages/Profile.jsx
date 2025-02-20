import React, {useEffect, useState} from 'react';
import {useAuth} from "../context/AuthContext";
import axios from "axios";

const Profile = () => {
    
    const { user, isUserLoading, authToken, updateUser } = useAuth();
    const [ guid, setGuid ] = useState('');

    useEffect(() => {
        if (user?.guid && !guid) {
            setGuid(user.guid);
        }
    }, [user]);
    
    if(!user) {
        return <h1>non connecté</h1>;
    }
    
    if(isUserLoading) {
        return <h1>Chargement...</h1>;
    }

    const handleBlur = async () => {
        if(guid.trim() === '' || guid === user.guid) {
            setGuid(user.guid);
            return;
        }

        try {
            await axios.put(`${process.env.REACT_APP_SEEK_AND_STOCK_API_URL}/user`, {guid}, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });
            
            updateUser({guid});
        } catch (e) {
            console.log(e)
        }
    }
    
    return (
        <div className={'flex items-center bg-slate-50 rounded-xl p-4 space-x-5'}>
            <img
                src={`https://cdn.discordapp.com/avatars/${user.discord_id}/${user.discord_avatar}.png`}
                alt="Avatar"
                className={'w-24 sm:w-36 rounded-full'}
            />
            <div className={'space-y-3'}>
                <span className={'text-2xl'}>{user.discord_global_name}</span>
                <div className={'flex flex-col'}>
                    <label htmlFor="guid" className="text-sm">GUID</label>
                    <input
                        onChange={(e) => setGuid(e.target.value)}
                        onBlur={handleBlur}
                        type="text"
                        id="guid"
                        className={`p-1 w-44 border border-gray-200 text-xxs md:w-64 focus:outline-none ${guid ? 'bg-none' : 'bg-red-100'}`}
                        placeholder={guid ? '' : 'Merci de renseigner votre GUID'}
                        value={guid}
                    />
                </div>
            </div>
        </div>
    );
};

export default Profile;
