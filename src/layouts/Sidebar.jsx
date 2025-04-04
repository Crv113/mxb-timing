import React, {useState} from 'react';
import SidebarItem from "../components/SidebarItem";
import {IoClose, IoHomeOutline, IoMenu} from "react-icons/io5";
import {VscSymbolEvent} from "react-icons/vsc";
import {FaDiscord} from "react-icons/fa";
import {useAuth} from "../context/AuthContext";
import {IoIosWarning, IoMdExit} from "react-icons/io";
import {NavLink} from "react-router-dom";
import {SlLocationPin} from "react-icons/sl";

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { isUserAuthenticated, user, logout, isAdmin } = useAuth();

    const handleLogin = () => {
        const currentUrl = encodeURIComponent(window.location.href);
        window.location.href = `${process.env.REACT_APP_LOGIN_DISCORD_URL_WITH_REDIRECT}${currentUrl}`;
    };

    return (
        <div>
            <button
                className="xl:hidden fixed top-2 left-5 z-20 text-2xl bg-white p-2 rounded shadow-md"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <IoClose /> : <IoMenu />}
            </button>

            {isOpen && (
                <div
                    className={`fixed inset-0 bg-black opacity-10 z-10`}
                    onClick={() => setIsOpen(false)}
                />
            )}

            <div
                className={`fixed top-0 left-0 bg-slate-50 text-slate-700 flex flex-col p-5 z-10 overflow-y-auto transition-transform duration-300 ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                } xl:translate-x-0 w-64`}
                style={{ height: 'var(--app-height)' }}
            >
                <img alt={'Logo mxb timing'} className="w-40 mx-auto" src={'/mxbt.png'}/>
                <ul className="list-none p-0 flex-grow">
                    <SidebarItem icon={IoHomeOutline} onClick={() => setIsOpen(false)} to="/">Home</SidebarItem>
                    <SidebarItem icon={VscSymbolEvent} onClick={() => setIsOpen(false)} to="/events">Events</SidebarItem>
                    {isUserAuthenticated && isAdmin && <SidebarItem icon={SlLocationPin} onClick={() => setIsOpen(false)} to="/tracks">Tracks</SidebarItem>}
                </ul>
                {isUserAuthenticated ? 
                    <div className={`flex items-center justify-between px-4 py-2 text-sm bg-gray-200 rounded-xl ${!user.guid && 'animate-pulse bg-red-300'}`}>
                        <NavLink to="/profile" onClick={() => setIsOpen(false)}>
                            <div className={'flex items-center space-x-3'}>
                                <img
                                    src={`https://cdn.discordapp.com/avatars/${user.discord_id}/${user.discord_avatar}.png`}
                                    alt="Avatar"
                                    className={'w-8 rounded-full'}
                                />
                                <span className={'font-semibold'}>{user.discord_global_name}</span>
                                {!user.guid && <IoIosWarning className="text-red-600 text-xl" />}
                            </div>
                        </NavLink>
                        <IoMdExit onClick={logout} className="text-xl hover:cursor-pointer" />
                    </div>
                    : 
                    <div className={'flex items-center space-x-3 px-4 py-2 text-sm'}>
                        <FaDiscord className="text-xl" />
                        <button onClick={handleLogin}>Login with Discord</button>
                    </div>}
                
            </div>
        </div>
        
    );
};

export default Sidebar;
