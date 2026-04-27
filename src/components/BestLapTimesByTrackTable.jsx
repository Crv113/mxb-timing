import React from 'react';
import { convertTimeFromMillisecondsToFormatted } from '../utils/time';
import useMediaQuery from '../hooks/useMediaQuery';

const BestLapTimesByTrackTable = ({ lapTimes }) => {
    const isLargeScreen = useMediaQuery('(min-width: 1024px)');

    if (!lapTimes?.length) {
        return null;
    }

    if (isLargeScreen) {
        return (
            <div className="overflow-x-auto rounded-2xl border text-sm w-full mt-3">
                <table className="w-full">
                    <thead className="border-b bg-neutral-50">
                        <tr className="text-gray-700">
                            <th className="py-3 px-4 text-left">Track</th>
                            <th className="py-3 px-4 text-left">Time</th>
                            <th className="py-3 px-4 text-left">Sector 1</th>
                            <th className="py-3 px-4 text-left">Sector 2</th>
                            <th className="py-3 px-4 text-left">Sector 3</th>
                            <th className="py-3 px-4 text-left">Bike</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lapTimes.map((lt) => (
                            <tr key={lt.id} className="border-b border-blue-gray-200">
                                <td className="py-3 px-4">{lt.event.track.name}</td>
                                <td className="py-3 px-4 font-semibold">{convertTimeFromMillisecondsToFormatted(lt.lap_time)}</td>
                                <td className="py-3 px-4">{convertTimeFromMillisecondsToFormatted(lt.lap_time_sector_1)}</td>
                                <td className="py-3 px-4">{convertTimeFromMillisecondsToFormatted(lt.lap_time_sector_2)}</td>
                                <td className="py-3 px-4">{convertTimeFromMillisecondsToFormatted(lt.lap_time_sector_3)}</td>
                                <td className="py-3 px-4">
                                    <span className={`bg-${lt.bike.name.split(' ')[0].toLowerCase()} text-white text-xs font-medium me-2 px-2.5 py-0.5 rounded whitespace-nowrap`}>
                                        {lt.bike.name}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto sm:rounded-2xl border text-xs w-full mt-3">
            <table className="w-full border-collapse">
                <thead className="border-b bg-neutral-50">
                    <tr className="text-gray-700">
                        <th className="w-1/3 text-left pl-2">Track</th>
                        <th className="w-1/3 text-center">Time</th>
                        <th className="w-1/3 text-right pr-2">Bike</th>
                    </tr>
                    <tr className="text-xs text-neutral-400">
                        <th className="w-1/3 text-left pl-2">Sector 1</th>
                        <th className="w-1/3 text-center">Sector 2</th>
                        <th className="w-1/3 text-right pr-2">Sector 3</th>
                    </tr>
                </thead>
                <tbody>
                    {lapTimes.map((lt) => (
                        <React.Fragment key={lt.id}>
                            <tr>
                                <td className="w-1/3 text-left pl-2">{lt.event.track.name}</td>
                                <td className="w-1/3 text-center font-semibold">{convertTimeFromMillisecondsToFormatted(lt.lap_time)}</td>
                                <td className="w-1/3 text-right pr-2">
                                    <span className={`bg-${lt.bike.name.split(' ')[0].toLowerCase()} text-white text-xxs font-medium px-2.5 py-0.5 rounded whitespace-nowrap`}>
                                        {lt.bike.name}
                                    </span>
                                </td>
                            </tr>
                            <tr className="border-b border-blue-gray-200 text-xs text-neutral-400">
                                <td className="w-1/3 text-left pl-2">{convertTimeFromMillisecondsToFormatted(lt.lap_time_sector_1)}</td>
                                <td className="w-1/3 text-center">{convertTimeFromMillisecondsToFormatted(lt.lap_time_sector_2)}</td>
                                <td className="w-1/3 text-right pr-2">{convertTimeFromMillisecondsToFormatted(lt.lap_time_sector_3)}</td>
                            </tr>
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BestLapTimesByTrackTable;
