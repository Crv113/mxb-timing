import React from 'react';
import SidebarItem from "../components/SidebarItem";
import {VscSymbolEvent} from "react-icons/vsc";
import {IoHomeOutline} from "react-icons/io5";

const Sidebar = () => {
    return (
        <div className="w-64 bg-slate-50 text-slate-500 flex flex-col p-5">
            <div className="text-2xl font-bold mb-5">MXB-Timing.com</div>
            <ul className="list-none p-0">
                <SidebarItem icon={IoHomeOutline} to="/">Home</SidebarItem>
                <SidebarItem icon={VscSymbolEvent} to="/events">Events</SidebarItem>
            </ul>
        </div>
    );
};

export default Sidebar;
