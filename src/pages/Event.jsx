import React, {useEffect, useMemo, useState} from 'react';
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Loading from "../components/Loading";
import DesktopLapTimeTable from "../components/DesktopLapTimeTable";
import MobileLapTimeTable from "../components/MobileLapTimeTable";
import useMediaQuery from "../hooks/useMediaQuery";
import { DateTime } from "luxon";
import {FaFlagCheckered, FaRegFlag} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { SlLocationPin } from "react-icons/sl";
import { convertTimeFromMillisecondsToFormatted } from "../utils/time";
import {toast} from "react-toastify";
import {GoTrophy} from "react-icons/go";

const fetchEvent = async (id) => {
    const { data } = await axios.get(`${import.meta.env.VITE_SEEK_AND_STOCK_API_URL}/events/${id}`, {
        headers: { Authorization: `Bearer ${import.meta.env.VITE_SEEK_AND_STOCK_API_TOKEN}` },
    });
    return data;
};

const fetchLapTimes = async (id) => {
    const { data } = await axios.get(`${import.meta.env.VITE_SEEK_AND_STOCK_API_URL}/events/${id}/results`, {
        headers: { Authorization: `Bearer ${import.meta.env.VITE_SEEK_AND_STOCK_API_TOKEN}` },
    });
    return data;
};

const Event = () => {
    const { id } = useParams();
    const { user, isUserAuthenticated } = useAuth();
    const isLargeScreen = useMediaQuery("(min-width: 1024px)");
    const [isCurrentEvent, setIsCurrentEvent] = useState(false);
    const [isFinishedEvent, setIsFinishedEvent] = useState(false);
    
    const { data: event, isLoading: isEventLoading, isError: isEventError } = useQuery({
        queryKey: ["event", id],
        queryFn: () => fetchEvent(id),
    });

    const { data: lapTimes, isLoading: isLapTimesLoading, isError: isLapTimesError = [] } = useQuery({
        queryKey: ["lapTimes", id],
        queryFn: () => fetchLapTimes(id),
    });

    const { startingDate, endingDate } = useMemo(() => {
        if (!event) return { startingDate: null, endingDate: null };
        return {
            startingDate: DateTime.fromFormat(event.starting_date, 'yyyy-MM-dd HH:mm:ss'),
            endingDate: DateTime.fromFormat(event.ending_date, 'yyyy-MM-dd HH:mm:ss'),
        };
    }, [event]);

    useEffect(() => {
        if (startingDate && endingDate) {
            const now = DateTime.now();
            setIsCurrentEvent(now >= startingDate && now <= endingDate);
            setIsFinishedEvent( now > endingDate);
        }
    }, [startingDate, endingDate]);

    useEffect(() => {
        if (isUserAuthenticated && user && !user.guid && isCurrentEvent ) {
            toast.info("Please enter your GUID in your profile.", {
                icon: () => "⚠️",
            });
        }
    }, [isUserAuthenticated, user, isCurrentEvent]);

    if (isEventLoading || isLapTimesLoading) return <Loading>Loading ..</Loading>;
    if (isEventError || isLapTimesError) return <p>Failed to fetch data</p>;


    return (
        <>
            <div className="flex mb-5">
                <img src={event.track.image} alt="event image" className="w-32 h-32 md:w-44 md:h-44 bg-neutral-800" />
                <div className="pl-2 md:space-y-1">
                    <h1 className="md:text-3xl font-semibold">{event.name}</h1>
                    <div className="flex items-center gap-2">
                        <SlLocationPin />
                        <h2 className="md:text-xl">{event.track.name}</h2>
                    </div>
                    <div className="flex items-center gap-2">
                        <FaRegFlag className="text-green-600" />
                        <span className="text-sm md:text-md">{startingDate.toFormat("ccc dd LLL yyyy HH:mm")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FaFlagCheckered />
                        <span className="text-sm md:text-md">{endingDate.toFormat("ccc dd LLL yyyy HH:mm")}</span>
                    </div>
                    {
                        isFinishedEvent &&
                        <div className="flex items-center gap-2">
                            <GoTrophy />
                            <span className="text-sm md:text-md">{event.best_lap_time.player_name}</span>
                        </div>
                    }
                </div>
            </div>
            {isLargeScreen ? (
                <DesktopLapTimeTable lapTimes={lapTimes} convertTimeFromMillisecondsToFormatted={convertTimeFromMillisecondsToFormatted} />
            ) : (
                <MobileLapTimeTable lapTimes={lapTimes} convertTimeFromMillisecondsToFormatted={convertTimeFromMillisecondsToFormatted} />
            )}
        </>
    );
};

export default Event;
