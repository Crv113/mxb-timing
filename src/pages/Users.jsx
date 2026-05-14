import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Loading from '../components/Loading';

const fetchUsers = async () => {
    const { data } = await axios.get(`${import.meta.env.VITE_SEEK_AND_STOCK_API_URL}/users`, {
        headers: { Authorization: `Bearer ${import.meta.env.VITE_SEEK_AND_STOCK_API_TOKEN}` },
    });
    return data;
};

const Users = () => {
    const { data: users, isLoading, isError } = useQuery({
        queryKey: ['users'],
        queryFn: fetchUsers,
    });

    if (isLoading) return <Loading>Loading ..</Loading>;
    if (isError) return <p>Failed to fetch users</p>;

    return (
        <div>
            <h1 className="text-2xl font-outfitMedium text-neutral-950 pb-5">Players</h1>
            <div className="overflow-x-auto rounded-2xl border text-sm w-full">
                <table className="w-full">
                    <thead className="border-b bg-neutral-50">
                        <tr className="text-gray-700">
                            <th className="py-3 px-4 text-left">Player</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className="border-b border-blue-gray-200 hover:bg-neutral-50">
                                <td className="py-3 px-4">
                                    <Link to={`/profile/${user.id}`} className="flex items-center space-x-3">
                                        <img
                                            src={`https://cdn.discordapp.com/avatars/${user.discord_id}/${user.discord_avatar}.png`}
                                            alt="avatar"
                                            className="w-8 h-8 rounded-full"
                                            onError={(e) => { e.target.src = '/default-avatar.png'; }}
                                        />
                                        <span>{user.name || user.discord_global_name}</span>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Users;
