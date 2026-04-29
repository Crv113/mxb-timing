import React from 'react';
import { Link } from 'react-router-dom';
import { BiPencil } from 'react-icons/bi';
import {truncateString} from "../utils/stringUtils";

const TrackCard = ({ track, isAdmin, onEdit }) => {
    return (
        <li className="relative bg-neutral-100 rounded-lg shadow w-52 p-2 border">
            <Link to={`/track/${track.id}`}>
                <img src={track.image} alt="track image" className="w-48 h-48 object-cover" />
                <h2 className="font-outfitRegular mt-2" title={track.name}>{truncateString(track.name, 20)}</h2>
            </Link>
            {isAdmin && (
                <button
                    onClick={onEdit}
                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-gray-100"
                >
                    <BiPencil className="text-base" />
                </button>
            )}
        </li>
    );
};

export default TrackCard;
