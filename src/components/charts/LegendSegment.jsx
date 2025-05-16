import React from 'react';
import { getColor } from '../../utils/colors';

const LegendSegment = ({ data }) => {
    return (
       <ul className='text-slate-700 flex flex-col'>
        {data.map((entry, index) => (
            <li key={index} className="flex items-center mb-1">
                <div
                    className="w-4 h-4 mr-2"
                    style={{ backgroundColor: getColor(entry.brand), borderRadius: '4px' }}
                />
                <span>{`${entry.name} (${entry.value})`}</span>
            </li>
        ))}
       </ul>
    );
};

export default LegendSegment;
