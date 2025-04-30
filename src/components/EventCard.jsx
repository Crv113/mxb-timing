import React from 'react';
import {Link} from "react-router-dom";
import {DateTime} from "luxon";
import {FaFlagCheckered, FaRegFlag} from "react-icons/fa";
import {GrStatusGoodSmall} from "react-icons/gr";
import {SlLocationPin} from "react-icons/sl";
import {GoTrophy} from "react-icons/go";

const EventCard = ({ event, status = 'current'}) => {
    const startingDate = DateTime.fromFormat(event.starting_date, 'yyyy-MM-dd HH:mm:ss');
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
        <Link to={to} state={{event}}>
            <li className={`${opacity} w-80 lg:w-96 bg-neutral-100 rounded-lg shadow p-2 border relative cursor-default flex
             ${disabled ? '' : 'hover:border-neutral-400 hover:cursor-pointer hover:shadow-lg duration-300'}`}
        >
                <img src={event.image ?? event.track.image} alt="event image" className="w-32 h-32 object-cover mr-2 rounded" />
                <div>
                    <div className="flex gap-2">
                        <GrStatusGoodSmall className={`mt-1 ${statusColor}`} />
                        <h2 className="font-outfitRegular">{event.name}</h2>
                    </div>
                    <div className="flex pt-1 gap-2">
                        <SlLocationPin className="mt-0.5"/>
                        <h3 className="font-outfitLight text-sm mt">{event.track.name}</h3>
                    </div>
                    <div className="flex flex-row pt-2 gap-2">
                        <div className="flex items-center gap-2">
                            <FaRegFlag className="text-green-600" />
                            <span className="text-xs">{startingDate.toFormat("ccc dd LLL yyyy HH:mm")}</span>
                        </div>
                    </div>
                    <div className="flex flex-row pt-2 gap-2">
                        <div className="flex items-center gap-2">
                            <FaFlagCheckered />
                            <span className="text-xs">{endingDate.toFormat("ccc dd LLL yyyy HH:mm")}</span>
                        </div>
                    </div>
                    {
                        status === "finished" &&
                        <div className="flex flex-row pt-2 gap-2">
                            <div className="flex items-center gap-2">
                                <GoTrophy />
                                <span className="text-xs">{event.best_lap_time.player_name}</span>
                            </div>
                        </div>
                    }
                </div>
            </li>
        </Link>
    );
};

export default EventCard;

