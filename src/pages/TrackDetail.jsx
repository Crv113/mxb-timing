import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Loading from '../components/Loading';
import DesktopLapTimeTable from '../components/DesktopLapTimeTable';
import MobileLapTimeTable from '../components/MobileLapTimeTable';
import useMediaQuery from '../hooks/useMediaQuery';
import { convertTimeFromMillisecondsToFormatted } from '../utils/time';

const fetchTrack = async (id) => {
    const { data } = await axios.get(`${import.meta.env.VITE_SEEK_AND_STOCK_API_URL}/tracks/${id}`, {
        headers: { Authorization: `Bearer ${import.meta.env.VITE_SEEK_AND_STOCK_API_TOKEN}` },
    });
    return data;
};

const fetchTrackResults = async (id) => {
    const { data } = await axios.get(`${import.meta.env.VITE_SEEK_AND_STOCK_API_URL}/tracks/${id}/results`, {
        headers: { Authorization: `Bearer ${import.meta.env.VITE_SEEK_AND_STOCK_API_TOKEN}` },
    });
    return data;
};

const TrackDetail = () => {
    const { id } = useParams();
    const isLargeScreen = useMediaQuery('(min-width: 1024px)');

    const { data: track, isLoading: isTrackLoading, isError: isTrackError } = useQuery({
        queryKey: ['track', id],
        queryFn: () => fetchTrack(id),
    });

    const { data: results, isLoading: isResultsLoading, isError: isResultsError } = useQuery({
        queryKey: ['track-results', id],
        queryFn: () => fetchTrackResults(id),
    });

    if (isTrackLoading || isResultsLoading) return <Loading>Loading ..</Loading>;
    if (isTrackError || isResultsError) return <p>Failed to fetch data</p>;

    return (
        <>
            <section className='flex bg-slate-50 rounded-xl p-4 gap-4 items-center'>
                {track.image && (
                    <img
                        src={track.image}
                        alt={track.name}
                        className='w-32 h-32 object-cover rounded-xl sm:w-48 sm:h-48'
                    />
                )}
                <div>
                    <h1 className='text-2xl font-semibold sm:text-3xl'>{track.name}</h1>
                    {track.length && (
                        <p className='text-slate-500 mt-1'>{track.length} m</p>
                    )}
                </div>
            </section>

            <section className='w-full border-2 border-gray-200 mt-4 rounded-xl p-4'>
                <h2 className='font-bold sm:text-lg'>Lap times</h2>
                {results?.data?.length > 0 ? (
                    isLargeScreen
                        ? <DesktopLapTimeTable lapTimes={results} convertTimeFromMillisecondsToFormatted={convertTimeFromMillisecondsToFormatted} />
                        : <MobileLapTimeTable lapTimes={results} convertTimeFromMillisecondsToFormatted={convertTimeFromMillisecondsToFormatted} />
                ) : (
                    <p className='text-center mt-4'>No lap times recorded on this track yet.</p>
                )}
            </section>
        </>
    );
};

export default TrackDetail;
