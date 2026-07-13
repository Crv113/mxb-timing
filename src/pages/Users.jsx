import React, {useCallback} from 'react';
import { Link } from 'react-router-dom';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import Loading from '../components/Loading';
import useMediaQuery from '../hooks/useMediaQuery';
import useInfiniteScrollSentinel from '../hooks/useInfiniteScrollSentinel';
import { getDisplayName } from '../utils/displayName';
import { FaDiscord } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const fetchUsers = async (cursor) => {
    const { data } = await axios.get(`${import.meta.env.VITE_SEEK_AND_STOCK_API_URL}/users`, {
        headers: { Authorization: `Bearer ${import.meta.env.VITE_SEEK_AND_STOCK_API_TOKEN}` },
        params: { cursor },
    });
    return data;
};

const fetchAnonymousPlayers = async (cursor) => {
    const { data } = await axios.get(`${import.meta.env.VITE_SEEK_AND_STOCK_API_URL}/players`, {
        headers: { Authorization: `Bearer ${import.meta.env.VITE_SEEK_AND_STOCK_API_TOKEN}` },
        params: { cursor },
    });
    return data;
};

const PlayerCell = ({ player, isAdmin }) => (
    <Link
        to={player.type === 'user' ? `/profile/${player.id}` : `/player/${player.id}`}
        className="flex items-center space-x-3"
    >
        <img
            src={player.type === 'user'
                ? `https://cdn.discordapp.com/avatars/${player.discord_id}/${player.discord_avatar}.png`
                : '/default-avatar.png'
            }
            alt="avatar"
            className="w-8 h-8 rounded-full"
            onError={(e) => { e.target.src = '/default-avatar.png'; }}
        />
        <span>{player.type === 'user' ? getDisplayName(player) : player.player_name}</span>
        {isAdmin && player.type === 'user' &&
            <FaDiscord className="w-3 h-3 text-indigo-400 shrink-0" title="Linked with Discord" />
        }
    </Link>
);

const BikeBadge = ({ bike }) => bike ? (
    <span className={`bg-${bike.split(' ')[0].toLowerCase()} text-white text-xs font-medium px-2.5 py-0.5 rounded whitespace-nowrap`}>
        {bike}
    </span>
) : <span>-</span>;

const Users = () => {
    const isLargeScreen = useMediaQuery('(min-width: 768px)');
    const { isAdmin } = useAuth();

    const {
        data: usersPages,
        isLoading: isUsersLoading,
        isError: isUsersError,
        fetchNextPage: fetchNextUsersPage,
        hasNextPage: hasNextUsersPage,
        isFetchingNextPage: isFetchingNextUsersPage,
    } = useInfiniteQuery({
        queryKey: ['users-list'],
        queryFn: ({ pageParam }) => fetchUsers(pageParam),
        initialPageParam: null,
        getNextPageParam: (lastPage) => lastPage.next_cursor ?? undefined,
    });

    const {
        data: anonymousPlayersPages,
        isLoading: isAnonLoading,
        isError: isAnonError,
        fetchNextPage: fetchNextAnonymousPlayersPage,
        hasNextPage: hasNextAnonymousPlayersPage,
        isFetchingNextPage: isFetchingNextAnonymousPlayersPage,
    } = useInfiniteQuery({
        queryKey: ['anonymous-players-list'],
        queryFn: ({ pageParam }) => fetchAnonymousPlayers(pageParam),
        initialPageParam: null,
        getNextPageParam: (lastPage) => lastPage.next_cursor ?? undefined,
    });

    const hasNextPage = hasNextUsersPage || hasNextAnonymousPlayersPage;
    const isFetchingNextPage = isFetchingNextUsersPage || isFetchingNextAnonymousPlayersPage;

    const sentinelRef = useInfiniteScrollSentinel(
        useCallback(() => {
            if (hasNextUsersPage) fetchNextUsersPage();
            if (hasNextAnonymousPlayersPage) fetchNextAnonymousPlayersPage();
        }, [hasNextUsersPage, fetchNextUsersPage, hasNextAnonymousPlayersPage, fetchNextAnonymousPlayersPage]),
        hasNextPage && !isFetchingNextPage
    );

    if (isUsersLoading || isAnonLoading) return <Loading>Loading ..</Loading>;
    if (isUsersError || isAnonError) return <p>Failed to fetch players</p>;

    const users = usersPages ? usersPages.pages.flatMap((page) => page.data) : [];
    const anonymousPlayers = anonymousPlayersPages ? anonymousPlayersPages.pages.flatMap((page) => page.data) : [];

    const allPlayers = [
        ...users.map(u => ({ ...u, type: 'user', favorite_bike: u.favorite_bike })),
        ...anonymousPlayers.map(a => ({ ...a, type: 'anonymous' })),
    ];

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
                        {allPlayers.map((player) => (
                            isLargeScreen ? (
                                <tr key={`${player.type}-${player.id}`} className="border-b border-blue-gray-200 hover:bg-neutral-50">
                                    <td className="py-3 px-4"><PlayerCell player={player} isAdmin={isAdmin} /></td>
                                    <td className="py-3 px-4">{player.participation_count}</td>
                                    <td className="py-3 px-4">{player.victory_count}</td>
                                    <td className="py-3 px-4"><BikeBadge bike={player.favorite_bike} /></td>
                                </tr>
                            ) : (
                                <React.Fragment key={`${player.type}-${player.id}`}>
                                    <tr>
                                        <td className="pt-2 px-3"><PlayerCell player={player} isAdmin={isAdmin} /></td>
                                        <td className="pt-2 px-3 text-right"><BikeBadge bike={player.favorite_bike} /></td>
                                    </tr>
                                    <tr className="border-b border-blue-gray-200 text-xs text-neutral-400">
                                        <td className="pb-2 px-3">{player.participation_count} participations</td>
                                        <td className="pb-2 px-3 text-right">{player.victory_count} victories</td>
                                    </tr>
                                </React.Fragment>
                            )
                        ))}
                    </tbody>
                </table>
            </div>
            <div ref={sentinelRef} />
            {isFetchingNextPage && <Loading>Loading more...</Loading>}
        </div>
    );
};

export default Users;
