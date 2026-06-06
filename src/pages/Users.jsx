import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Loading from '../components/Loading';
import useMediaQuery from '../hooks/useMediaQuery';
import { getDisplayName } from '../utils/displayName';

const fetchUsers = async () => {
    const { data } = await axios.get(`${import.meta.env.VITE_SEEK_AND_STOCK_API_URL}/users`, {
        headers: { Authorization: `Bearer ${import.meta.env.VITE_SEEK_AND_STOCK_API_TOKEN}` },
    });
    return data;
};

const UserAvatar = ({ user }) => (
    <Link to={`/profile/${user.id}`} className="flex items-center space-x-3">
        <img
            src={`https://cdn.discordapp.com/avatars/${user.discord_id}/${user.discord_avatar}.png`}
            alt="avatar"
            className="w-8 h-8 rounded-full"
            onError={(e) => { e.target.src = '/default-avatar.png'; }}
        />
        <span>{getDisplayName(user)}</span>
    </Link>
);

const BikeBadge = ({ bike }) => bike ? (
    <span className={`bg-${bike.split(' ')[0].toLowerCase()} text-white text-xs font-medium px-2.5 py-0.5 rounded whitespace-nowrap`}>
        {bike}
    </span>
) : <span>-</span>;

const Users = () => {
    const isLargeScreen = useMediaQuery('(min-width: 768px)');

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
                <table className="w-full border-collapse">
                    <thead className="border-b bg-neutral-50">
                        {isLargeScreen ? (
                            <tr className="text-gray-700">
                                <th className="py-3 px-4 text-left">Name</th>
                                <th className="py-3 px-4 text-left">Participations</th>
                                <th className="py-3 px-4 text-left">Victories</th>
                                <th className="py-3 px-4 text-left">Favorite bike</th>
                            </tr>
                        ) : (
                            <>
                                <tr className="text-gray-700">
                                    <th className="py-2 px-3 text-left">Name</th>
                                    <th className="py-2 px-3 text-right">Favorite bike</th>
                                </tr>
                                <tr className="text-xs text-neutral-400">
                                    <th className="pb-2 px-3 text-left">Participations</th>
                                    <th className="pb-2 px-3 text-right">Victories</th>
                                </tr>
                            </>
                        )}
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            isLargeScreen ? (
                                <tr key={user.id} className="border-b border-blue-gray-200 hover:bg-neutral-50">
                                    <td className="py-3 px-4"><UserAvatar user={user} /></td>
                                    <td className="py-3 px-4">{user.participation_count}</td>
                                    <td className="py-3 px-4">{user.victory_count}</td>
                                    <td className="py-3 px-4"><BikeBadge bike={user.favorite_bike} /></td>
                                </tr>
                            ) : (
                                <React.Fragment key={user.id}>
                                    <tr>
                                        <td className="pt-2 px-3"><UserAvatar user={user} /></td>
                                        <td className="pt-2 px-3 text-right"><BikeBadge bike={user.favorite_bike} /></td>
                                    </tr>
                                    <tr className="border-b border-blue-gray-200 text-xs text-neutral-400">
                                        <td className="pb-2 px-3">{user.participation_count} participations</td>
                                        <td className="pb-2 px-3 text-right">{user.victory_count} victories</td>
                                    </tr>
                                </React.Fragment>
                            )
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Users;
