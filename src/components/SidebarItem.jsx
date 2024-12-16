import React from 'react';
import {NavLink} from "react-router-dom";

const SidebarItem = ({ icon: Icon, to, children }) => {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-2 text-sm ${
                    isActive ? 'text-red-600' : 'text-neutral-600 hover:text-neutral-950 hover:cursor-pointer'
                }`
            }
        >
            <Icon className="text-xl" />
            <span>{children}</span>
        </NavLink>
    );
};

export default SidebarItem;