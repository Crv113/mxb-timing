import React from 'react';
import {truncateString} from "../utils/stringUtils";
import {isWithinLastTwoHours} from "../utils/time";
import {Link} from "react-router-dom";

const MobileLapTimeTable = ({lapTimes, convertTimeFromMillisecondsToFormatted}) => {

    return (
        <div>
            <div className="flex mt-20">
                <div className="overflow-x-auto sm:rounded-2xl border text-xs w-full">
                    <table className="w-full border-collapse">
                        <thead className="border-b bg-neutral-50">
                            <tr className="bg-blue-gray-100 text-gray-700">
                                <th></th>
                                <th className="w-1/3 text-left pl-2">Name</th>
                                <th className="w-1/3 text-center">Time</th>
                                <th className="w-1/3 text-right pr-2">Bike</th>
                            </tr>
                            <tr className="text-xs text-neutral-400">
                                <th></th>
                                <th className="w-1/3 text-left pl-2">Sector 1</th>
                                <th className="w-1/3 text-center">Sector 2</th>
                                <th className="w-1/3 text-right pr-2">Sector 3</th>
                            </tr>
                        </thead>
                        <tbody className="text-blue-gray-900 hover:cursor-default">
                        {lapTimes.data.map((lapTime, index) => (
                            <React.Fragment key={lapTime.id}>
                                <tr>
                                    <td className="text-left pl-2">{index + 1}</td>
                                    <td className="w-1/3 text-left pl-2">
                                        <Link to={`/profile/${lapTime.user_id}`}>{truncateString(lapTime.player_name)}</Link>
                                    </td>
                                    <td className="w-1/3 text-center font-semibold relative">
                                        {convertTimeFromMillisecondsToFormatted(lapTime.lap_time)}
                                        {isWithinLastTwoHours(lapTime.created_at) && (
                                            <span className="absolute -top-1 text-red-500 text-[6px] font-bold">
                                            NEW
                                        </span>
                                        )}
                                    </td>
                                    <td className="w-1/3 text-right pr-2">
                                         <span
                                             className={`bg-${lapTime.bike.name.split(" ")[0].toLowerCase()}
                                                    text-white text-xxs font-medium px-2.5 py-0.5 rounded whitespace-nowrap`}
                                         >
                                            {lapTime.bike.name}
                                        </span>
                                    </td>
                                </tr>
                                <tr className="border-b border-blue-gray-200 text-xs text-neutral-400">
                                    <td></td>
                                    <td className="w-1/3 text-left pl-2">{convertTimeFromMillisecondsToFormatted(lapTime.lap_time_sector_1)}</td>
                                    <td className="w-1/3 text-center">{convertTimeFromMillisecondsToFormatted(lapTime.lap_time_sector_2)}</td>
                                    <td className="w-1/3 text-right pr-2">{convertTimeFromMillisecondsToFormatted(lapTime.lap_time_sector_3)}</td>
                                </tr>
                            </React.Fragment>

                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MobileLapTimeTable;
