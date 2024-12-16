import React, {useState} from 'react';
import {truncateString} from "../utils/stringUtils";

const MobileLapTimeTable = ({lapTimes, convertTime}) => {

    return (
        <div className="events-content">
            <div className="flex mt-20">
                <div className="overflow-x-auto sm:rounded-2xl border text-xs w-full">
                    <table className="w-full border-collapse">
                        <thead className="border-b bg-neutral-50">
                        <tr className="bg-blue-gray-100 text-gray-700">
                            <th className="w-1/3 text-left pl-2">Name</th>
                            <th className="w-1/3 text-center">Time</th>
                            <th className="w-1/3 text-right pr-2">Bike</th>
                        </tr>
                        <tr className="text-xs text-neutral-400">
                            <th className="w-1/3 text-left pl-2">Sector 1</th>
                            <th className="w-1/3 text-center">Sector 2</th>
                            <th className="w-1/3 text-right pr-2">Sector 3</th>
                        </tr>
                        </thead>
                        <tbody className="text-blue-gray-900 hover:cursor-default">
                        {lapTimes.data.map(lapTime => (
                            <>
                                <tr key={lapTime.id}>
                                    <td className="w-1/3 text-left pl-2">{truncateString(lapTime.player_name)}</td>
                                    <td className="w-1/3 text-center font-semibold">{convertTime(lapTime.lap_time)}</td>
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
                                    <td className="w-1/3 text-left pl-2">{convertTime(lapTime.lap_time_sector_1)}</td>
                                    <td className="w-1/3 text-center">{convertTime(lapTime.lap_time_sector_2)}</td>
                                    <td className="w-1/3 text-right pr-2">{convertTime(lapTime.lap_time_sector_3)}</td>
                                </tr>
                            </>

                        ))}
                        </tbody>
                    </table>
                    
                    
                    
                    {/*<table className="w-full">*/}
                    {/*    <thead className="border-b bg-neutral-50">*/}
                    {/*        <tr className="bg-blue-gray-100 text-gray-700">*/}
                    {/*            <th colSpan="3">*/}
                    {/*                <div className="flex justify-between">*/}
                    {/*                    <span className="inline-flex">Name</span>*/}
                    {/*                    <span className="inline-flex">Time</span>*/}
                    {/*                    <span className="inline-flex">Bike</span>*/}
                    {/*                </div>*/}
                    {/*            </th>*/}
                    {/*        </tr>*/}
                    {/*        <tr>*/}
                    {/*            <th colSpan="3">*/}
                    {/*                <div className="flex justify-between text-xs text-neutral-400">*/}
                    {/*                    <span className="inline-flex">Sector 1</span>*/}
                    {/*                    <span className="inline-flex">Sector 2</span>*/}
                    {/*                    <span className="inline-flex">Sector 3</span>*/}
                    {/*                </div>*/}
                    {/*            </th>*/}
                    {/*        </tr>*/}
                    {/*    </thead>*/}
                    {/*    <tbody className="text-blue-gray-900">*/}
                    {/*    {lapTimes.data.map(lapTime => (*/}
                    {/*        <>*/}
                    {/*            <tr key={lapTime.id} className="hover:cursor-default">*/}
                    {/*                <td colSpan="3">*/}
                    {/*                    <div className="flex justify-between">*/}
                    {/*                        <span className="inline-flex">{truncateString(lapTime.player_name)}</span>*/}
                    {/*                        <span className="inline-flex font-semibold">{convertTime(lapTime.lap_time)}</span>*/}
                    {/*                        <span className="inline-flex">*/}
                    {/*                            <span*/}
                    {/*                                className={`bg-${lapTime.bike.name.split(" ")[0].toLowerCase()} */}
                    {/*                                text-white text-xs font-medium px-2.5 py-0.5 rounded whitespace-nowrap`}*/}
                    {/*                                    >*/}
                    {/*                                {lapTime.bike.name}*/}
                    {/*                            </span>*/}
                    {/*                        </span>*/}
                    {/*                    </div>*/}
                    {/*                </td>*/}
                    {/*            </tr>*/}
                    {/*            <tr className="border-b border-blue-gray-200 hover:cursor-default">*/}
                    {/*                <td colSpan="3">*/}
                    {/*                    <div className="flex justify-between text-xs text-neutral-400">*/}
                    {/*                        <span className="inline-flex">{convertTime(lapTime.lap_time_sector_1)}</span>*/}
                    {/*                        <span className="inline-flex">{convertTime(lapTime.lap_time_sector_2)}</span>*/}
                    {/*                        <span className="inline-flex">{convertTime(lapTime.lap_time_sector_3)}</span>*/}
                    {/*                    </div>*/}
                    {/*                </td>*/}
                    {/*            </tr>*/}
                    {/*        </>*/}
                    {/*        */}
                    {/*    ))}*/}
                    {/*    </tbody>*/}
                    {/*</table>*/}
                </div>
            </div>
        </div>
    );
};

export default MobileLapTimeTable;
