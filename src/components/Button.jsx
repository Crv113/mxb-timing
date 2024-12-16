import React from 'react';

const Button = ({ onClick, icon: Icon, children, color }) => {
    
    let bgColor;
    let bgColorHover;
    let textColor = 'text-white';
    switch (color) {
        case 'success':
            bgColor = 'bg-green-700';
            bgColorHover = 'hover:bg-green-600';
            break;
            
        case 'danger':
            bgColor = 'bg-red-700';
            bgColorHover = 'hover:bg-red-600';
            break;
            
        case 'secondary':
            bgColor = 'bg-neutral-200';
            bgColorHover = 'hover:bg-neutral-300';
            textColor = 'text-neutral-950'
            break;
            
        case 'primary':
        default:
            bgColor = 'bg-neutral-950';
            bgColorHover = 'hover:bg-neutral-800';
            textColor = 'text-neutral-100'
            break;
            
    }

    return (
        <button
            onClick={onClick}
            className={`${bgColor} ${bgColorHover} ${textColor} float-end font-bold py-1 px-2 rounded inline-flex items-center`}
        >
            {Icon && <Icon className="fill-current w-4 h-4 mr-2"/>}
            <span className="text-sm">{children}</span>
        </button>
    );
};

export default Button;
