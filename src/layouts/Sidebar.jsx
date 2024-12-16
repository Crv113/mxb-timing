import React, {useState} from 'react';
import SidebarItem from "../components/SidebarItem";
import {IoClose, IoHomeOutline, IoMenu} from "react-icons/io5";
import {VscSymbolEvent} from "react-icons/vsc";

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false); // État pour contrôler l'ouverture de la Sidebar

    return (
        <div>
            <button
                className="xl:hidden fixed top-4 left-4 z-20 text-2xl bg-white p-2 rounded shadow-md"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <IoClose /> : <IoMenu />}
            </button>
            <div
                className={`fixed top-0 left-0 h-full bg-slate-50 text-slate-700 flex flex-col p-5 z-10 transition-transform duration-300 ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                } xl:translate-x-0 xl:static w-64`}    
            >
                <div className="text-2xl font-bold mb-5">MXB-Timing.com</div>
                <ul className="list-none p-0">
                    <SidebarItem icon={IoHomeOutline} to="/">Home</SidebarItem>
                    <SidebarItem icon={VscSymbolEvent} to="/events">Events</SidebarItem>
                    <SidebarItem icon={VscSymbolEvent} to="/test">Test</SidebarItem>
                </ul>
            </div>
        </div>
        
    );
};

export default Sidebar;
