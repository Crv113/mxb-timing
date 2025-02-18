import React, {useEffect, useRef, useState} from 'react';
import SidebarItem from "../components/SidebarItem";
import {IoClose, IoHomeOutline, IoMenu} from "react-icons/io5";
import {VscSymbolEvent} from "react-icons/vsc";
import {FaDiscord, FaMapMarkerAlt} from "react-icons/fa";
import {useAuth} from "../context/AuthContext";
import {IoMdExit} from "react-icons/io";
import {NavLink} from "react-router-dom";

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout } = useAuth();

    const handleLogin = () => {
        window.location.href = "http://127.0.0.1:80/login/discord";
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
                className={`fixed top-0 left-0 h-full bg-slate-50 text-slate-700 flex flex-col p-5 z-10 transition-transform duration-300 ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                } xl:translate-x-0 xl:static w-64`}    
            >
                <img alt={'Logo mxb timing'} className="w-40 mx-auto" src={'/mxbt.png'}/>
                {/*<div className="text-2xl font-bold mb-5">MXB-Timing.com</div>*/}
                <ul className="list-none p-0 flex-grow">
                    <SidebarItem icon={IoHomeOutline} onClick={() => setIsOpen(false)} to="/">Home</SidebarItem>
                    <SidebarItem icon={VscSymbolEvent} onClick={() => setIsOpen(false)} to="/events">Events</SidebarItem>
                    <SidebarItem icon={FaMapMarkerAlt} onClick={() => setIsOpen(false)} to="/tracks">Tracks</SidebarItem>
                    <SidebarItem icon={VscSymbolEvent} onClick={() => setIsOpen(false)} to="/test">Test</SidebarItem>
                </ul>
                {user ? 
                    <div className={'flex items-center justify-between px-4 py-2 text-sm bg-gray-200 rounded-xl'}>
                        <NavLink to="/profile" onClick={() => setIsOpen(false)}>
                            <div className={'flex items-center space-x-3'}>
                                <img
                                    src={`https://cdn.discordapp.com/avatars/${user.discord_id}/${user.discord_avatar}.png`}
                                    alt="Avatar"
                                    className={'w-8 rounded-full'}
                                />
                                <span className={'font-semibold'}>{user.discord_global_name}</span>
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
