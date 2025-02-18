import React from 'react';
import {FaMapMarkerAlt} from "react-icons/fa";
import {truncateString} from "../utils/stringUtils";

const TrackCard = ({ track, onClick }) => {
    return (
            <li className="bg-neutral-100 rounded-lg shadow w-52 p-2 border hover:cursor-pointer" onClick={onClick}>
                <img src={track.image} alt="track image" className="w-48 h-48 object-cover" />
                <h2 className="font-outfitRegular mt-2" title={track.name}>{truncateString(track.name, 20)}</h2>
            </li>
    );
};

export default TrackCard;
