import React from 'react';
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Loading from "../components/Loading";
import DesktopLapTimeTable from "../components/DesktopLapTimeTable";
import MobileLapTimeTable from "../components/MobileLapTimeTable";
import useMediaQuery from "../hooks/useMediaQuery";
import { DateTime } from "luxon";
import { FaFlagCheckered } from "react-icons/fa";
import Button from "../components/Button";
import { MdDownloadDone } from "react-icons/md";
import { useAuth } from "../context/AuthContext";
import { RxCross1 } from "react-icons/rx";
import { SlLocationPin } from "react-icons/sl";
import { convertTime } from "../utils/time";
import {toast} from "react-toastify";

const fetchEvent = async (id) => {
    const { data } = await axios.get(`${process.env.REACT_APP_SEEK_AND_STOCK_API_URL}/events/${id}`, {
        headers: { Authorization: `Bearer ${process.env.REACT_APP_SEEK_AND_STOCK_API_TOKEN}` },
    });
    return data;
};

const fetchLapTimes = async (id) => {
    const { data } = await axios.get(`${process.env.REACT_APP_SEEK_AND_STOCK_API_URL}/events/${id}/results`, {
        headers: { Authorization: `Bearer ${process.env.REACT_APP_SEEK_AND_STOCK_API_TOKEN}` },
    });
    return data;
};

const fetchEventUsers = async (id) => {
    const { data } = await axios.get(`${process.env.REACT_APP_SEEK_AND_STOCK_API_URL}/events/${id}/users`, {
        headers: { Authorization: `Bearer ${process.env.REACT_APP_SEEK_AND_STOCK_API_TOKEN}` },
    });
    return data;
};

const Event = () => {
    const { id } = useParams();
    const queryClient = useQueryClient();
    const { user, authToken } = useAuth();
    const isLargeScreen = useMediaQuery("(min-width: 1024px)");

    const { data: event, isLoading: isEventLoading, isError: isEventError } = useQuery({
        queryKey: ["event", id],
        queryFn: () => fetchEvent(id),
    });

    const { data: lapTimes, isLoading: isLapTimesLoading, isError: isLapTimesError = [] } = useQuery({
        queryKey: ["lapTimes", id],
        queryFn: () => fetchLapTimes(id),
    });

    const { data: guids, isLoading: isGuidsLoading, isError: isGuidsError = [] } = useQuery({
        queryKey: ["eventUsers", id],
        queryFn: () => fetchEventUsers(id),
    });

    const registerMutation = useMutation({
        mutationFn: async () => {
            await axios.post(`${process.env.REACT_APP_SEEK_AND_STOCK_API_URL}/events/${id}/register`, {}, {
                headers: { Authorization: `Bearer ${authToken}` },
            });
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries(["eventUsers", id]);
            await queryClient.invalidateQueries(["lapTimes", id]);
            toast.info("You have joined the event", {
                icon: () => "🎉",
            });

        },
    });

    const unregisterMutation = useMutation({
        mutationFn: async () => {
            await axios.post(`${process.env.REACT_APP_SEEK_AND_STOCK_API_URL}/events/${id}/unregister`, {}, {
                headers: { Authorization: `Bearer ${authToken}` },
            });
        },
        onSuccess: async () => {
           await queryClient.invalidateQueries(["eventUsers", id]);
           await queryClient.invalidateQueries(["lapTimes", id]);
            toast.info("You have left the event", {
                icon: () => "👋",
            });

        },
    });

    if (isEventLoading || isLapTimesLoading || isGuidsLoading) return <Loading>Loading ..</Loading>;
    if (isEventError || isLapTimesError || isGuidsError) return <p>Failed to fetch data</p>;

    const startingDate = DateTime.fromFormat(event.starting_date, 'yyyy-MM-dd HH:mm:ss');
    const endingDate = DateTime.fromFormat(event.ending_date, 'yyyy-MM-dd HH:mm:ss');
    const now = DateTime.now();
    const isCurrentEvent = now >= startingDate && now <= endingDate;
    const isSubscribe = user ? guids.includes(user.guid) : false;

    return (
        <>
            <div className="flex mb-5">
                <img src={event.track.image} alt="event image" className="w-44 h-44 bg-neutral-800" />
                <div className="pl-2">
                    <h1 className="text-3xl font-semibold">{event.name}</h1>
                    <div className="flex items-center gap-2">
                        <SlLocationPin />
                        <h2 className="text-xl">{event.track.name}</h2>
                    </div>
                    <div className="flex items-center gap-2">
                        <FaFlagCheckered />
                        <span>{endingDate.toFormat("ccc dd LLL yyyy HH:mm")}</span>
                    </div>
                    {(user && isCurrentEvent && !isSubscribe) && (
                        <Button icon={MdDownloadDone} color="secondary" onClick={() => registerMutation.mutate()}>
                            Join event
                        </Button>
                    )}
                    {(user && isCurrentEvent && isSubscribe) && (
                        <Button icon={RxCross1} color="primary" onClick={() => unregisterMutation.mutate()}>
                            Leave event
                        </Button>
                    )}
                </div>
            </div>
            {isLargeScreen ? (
                <DesktopLapTimeTable lapTimes={lapTimes} convertTime={convertTime} />
            ) : (
                <MobileLapTimeTable lapTimes={lapTimes} convertTime={convertTime} />
            )}
        </>
    );
};

export default Event;
