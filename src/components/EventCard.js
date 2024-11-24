import React from 'react';
import {Link} from "react-router-dom";
import {DateTime} from "luxon";
import {FaFlagCheckered, FaMapMarkerAlt} from "react-icons/fa";
import {GrStatusGoodSmall} from "react-icons/gr";

const EventCard = ({ event, status = 'current'}) => {
    const endingDate = DateTime.fromFormat(event.ending_date, 'yyyy-MM-dd HH:mm:ss');
    
    let to;
    let opacity;
    let statusColor;
    let disabled = false;
    switch (status) {
        case 'upcoming':
            to = '';
            opacity = 'opacity-50';
            statusColor = 'text-orange-400';
            disabled = true;
            break;
            
        case 'finished':
            to = `/event/${event.id}`;
            opacity = 'opacity-50';
            statusColor = 'text-red-600';
            break;

        case 'current':
        default:
            to = `/event/${event.id}`;
            opacity = 'opacity-1';
            statusColor = 'text-green-600';
            break;
    }

    return (
        <Link to={to}>
            <li className={`${opacity} bg-gray-100 rounded-lg shadow w-80 p-6 border relative cursor-default
             ${disabled ? '' : 'hover:border-slate-500 transition-colors hover:cursor-pointer hover:shadow-lg transition-shadow duration-300'}`
            }>
                <div className="flex items-center gap-2">
                    <GrStatusGoodSmall className={statusColor} />
                    <h2 className="font-outfitRegular text-xl">{event.name}</h2>
                </div>
                <div className="flex items-center pt-1 gap-2">
                    <FaMapMarkerAlt/>
                    <h3 className="font-outfitLight text-sm">{event.track.name}</h3>
                </div>
                <div className="flex flex-row pt-2 gap-2">
                    <div className="flex items-center gap-2">
                        <FaFlagCheckered />
                        <span className="text-xs">{endingDate.toFormat("ccc dd LLL yyyy HH:mm")}</span>
                    </div>
                </div>
            </li>
        </Link>
    );
};

export default EventCard;
