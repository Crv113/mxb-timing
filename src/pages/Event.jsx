import React, {useCallback, useEffect, useState} from 'react';
import axios from 'axios';
import {useParams} from "react-router-dom";
import Loading from "../components/Loading";
import DesktopLapTimeTable from "../components/DesktopLapTimeTable";
import MobileLapTimeTable from "../components/MobileLapTimeTable";
import useMediaQuery from "../hooks/useMediaQuery";
import {DateTime} from "luxon";
import {FaFlagCheckered} from "react-icons/fa";
import Button from "../components/Button";
import {MdDownloadDone} from "react-icons/md";
import {useAuth} from "../context/AuthContext";
import {RxCross1} from "react-icons/rx";
import {SlLocationPin} from "react-icons/sl";

const Event = () => {
    const { user, authToken } = useAuth();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [endingDate, setEndingDate] = useState(null);
    const [startingDate, setStartingDate] = useState(null);
    const [event, setEvent] = useState(null);
    const [isCurrentEvent, setIsCurrentEvent] = useState(false);
    const [lapTimes, setLapTimes] = useState([]);
    const [guids, setGuids] = useState([]);
    const [isSubscribe, setIsSubscribe] = useState(false);

    const isLargeScreen = useMediaQuery("(min-width: 1024px)");

    const fetchLapTimes = useCallback(async () => {
        try {
            const {data: fetchedLapTimes} = await axios.get(`${process.env.REACT_APP_SEEK_AND_STOCK_API_URL}/events/${id}/results`, {
                headers: {
                    Authorization: `Bearer ${process.env.REACT_APP_SEEK_AND_STOCK_API_TOKEN}`
                }
            });
            setLapTimes(fetchedLapTimes);
        } catch (e) {
            console.error("Failed to fetch lap times", e);
        }
    }, [id]);

    useEffect(() => {
    
        const fetchData = async () => {
            try {
                const {data: fetchedEvent} = await axios.get(`${process.env.REACT_APP_SEEK_AND_STOCK_API_URL}/events/${id}`, {
                    headers: {
                        Authorization: `Bearer ${process.env.REACT_APP_SEEK_AND_STOCK_API_TOKEN}`
                    }
                });
                setEvent(fetchedEvent);
                
                await fetchLapTimes();

                const {data: fetchedEventUsers} = await axios.get(`${process.env.REACT_APP_SEEK_AND_STOCK_API_URL}/events/${id}/users`, {
                    headers: {
                        Authorization: `Bearer ${process.env.REACT_APP_SEEK_AND_STOCK_API_TOKEN}`
                    }
                });
                setGuids(fetchedEventUsers);
            } catch (e) {
                setError("Failed to fetch data");
            } finally {
                setLoading(false)
            }
        }

        fetchData().catch(console.error);
    }, [id, fetchLapTimes]);

    useEffect(() => {

        if(event) {
            setStartingDate(DateTime.fromFormat(event.starting_date, 'yyyy-MM-dd HH:mm:ss'));
            setEndingDate(DateTime.fromFormat(event.ending_date, 'yyyy-MM-dd HH:mm:ss'));

            const now = DateTime.now();
            setIsCurrentEvent(now >= startingDate && now <= endingDate);
        }
        
        if(user) {
            setIsSubscribe(guids.includes(user.guid))
        }
       
    }, [event, guids]);


    if (loading) {
        return <Loading>Loading ..</Loading>;
    }

    if (error) {
        return <p>{error}</p>;
    }
    
    function convertTime(seconds) {
        const minutes = Math.floor(seconds / 60); // Nombre entier de minutes
        const remainingSeconds = (seconds % 60).toFixed(3); // Secondes restantes avec 3 décimales

        return `${minutes}.${remainingSeconds}`;
    }
    
    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${process.env.REACT_APP_SEEK_AND_STOCK_API_URL}/events/${id}/register`, {}, {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            });
            
            setGuids((prevGuids) => [...new Set([...prevGuids, user.guid])]);
            await fetchLapTimes();
        } catch (e) {
            console.log(e);
        }
    }

    const handleUnsubscribe = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${process.env.REACT_APP_SEEK_AND_STOCK_API_URL}/events/${id}/unregister`, {}, {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            });

            setGuids((prevGuids) => prevGuids.filter(guid => guid !== user.guid));
            await fetchLapTimes();
        } catch (e) {
            console.log(e);
        }
    }
    
    return (
        <>
            <div className="flex mb-5">
                <img src={event.track.image} alt="event image" className="w-44 h-44 bg-neutral-800" />
                <div className="pl-2">
                    <h1 className="text-3xl font-semibold">{event.name}</h1>
                    <div className="flex items-center gap-2">
                        <SlLocationPin/>
                        <h2 className="text-xl">{event.track.name}</h2>
                    </div>
                    <div className="flex items-center gap-2">
                        <FaFlagCheckered />
                        <span>{endingDate.toFormat("ccc dd LLL yyyy HH:mm")}</span>
                    </div>
                    {(user && isCurrentEvent && !isSubscribe ) && <Button icon={MdDownloadDone} color="secondary" onClick={handleRegister}>Register</Button>}
                    {(user && isCurrentEvent && isSubscribe ) && <Button icon={RxCross1} color="primary" onClick={handleUnsubscribe}>Unsubscribe</Button>}
                    
                </div>
            </div>
            {isLargeScreen ? <DesktopLapTimeTable lapTimes={lapTimes} convertTime={convertTime}/> :
                <MobileLapTimeTable lapTimes={lapTimes} convertTime={convertTime}/>}
        </>
    );
};

export default Event;
