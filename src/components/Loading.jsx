import React from 'react';
import {FaSpinner} from "react-icons/fa";

const Loading = ({ children }) => {

    return (
        <div className="flex flex-col items-center justify-center h-screen text-slate-900">
            <FaSpinner className="animate-spin text-xl mb-4" />
            <p>{children}</p>
        </div>
    );
};

export default Loading;
