import React, {useState} from 'react';
import {truncateString} from "../utils/stringUtils";

const DesktopLapTimeTable = ({lapTimes, convertTime}) => {
    
    return (
        <div className="events-content">
            <div className="flex">
                <div className="overflow-x-auto rounded-2xl border text-sm w-full">
                    <table className="w-full">
                        <thead className="border-b bg-neutral-50">
                        <tr className="bg-blue-gray-100 text-gray-700">
                            <th className="py-3 px-4 text-left">Pos.</th>
                            <th className="py-3 px-4 text-left">Name</th>
                            <th className="py-3 px-4 text-left">Time</th>
                            <th className="py-3 px-4 text-left">Sector 1</th>
                            <th className="py-3 px-4 text-left">Sector 2</th>
                            <th className="py-3 px-4 text-left">Sector 3</th>
                            <th className="py-3 px-4 text-left hidden 2xl:table-cell text-nowrap">Average speed</th>
                            <th className="py-3 px-4 text-left hidden lg:table-cell">Category</th>
                            <th className="py-3 px-4 text-left">Bike</th>
                        </tr>
                        </thead>
                        <tbody className="text-blue-gray-900">
                        {lapTimes.data.map((lapTime, index)=> (
                            <tr key={lapTime.id} className="border-b border-blue-gray-200 hover:cursor-default">
                                <td className="py-3 px-4">{index + 1}</td>
                                <td className="py-3 px-4 text-nowrap" title={lapTime.player_name}>{truncateString(lapTime.player_name)}</td>
                                <td className="py-3 px-4 font-semibold">{convertTime(lapTime.lap_time)}</td>
                                <td className="py-3 px-4">{convertTime(lapTime.lap_time_sector_1)}</td>
                                <td className="py-3 px-4">{convertTime(lapTime.lap_time_sector_2)}</td>
                                <td className="py-3 px-4">{convertTime(lapTime.lap_time_sector_3)}</td>
                                <td className="py-3 px-4 hidden 2xl:table-cell">{lapTime.average_speed} km/h</td>
                                <td className="py-3 px-4 hidden lg:table-cell text-nowrap">{lapTime.bike.category.name}</td>
                                <td className="py-3 px-4">
                                    <span
                                        className={`bg-${lapTime.bike.name.split(" ")[0].toLowerCase()} 
                                        text-white text-xs font-medium me-2 px-2.5 py-0.5 rounded whitespace-nowrap`}
                                    >
                                        {lapTime.bike.name}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DesktopLapTimeTable;
