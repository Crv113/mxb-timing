import React from 'react';
import {NavLink} from "react-router-dom";

const SidebarItem = ({ icon: Icon, to, children }) => {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-2 text-sm ${
                    isActive ? 'text-red-500' : 'hover:text-slate-900 hover:cursor-pointer text-slate-500'
                }`
            }
        >
            <Icon className="text-xl" />
            <span>{children}</span>
        </NavLink>
    );
};

export default SidebarItem;