import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {useLocation, useParams} from "react-router-dom";
import Loading from "../components/Loading";
import DesktopLapTimeTable from "../components/DesktopLapTimeTable";
import MobileLapTimeTable from "../components/MobileLapTimeTable";
import useMediaQuery from "../hooks/useMediaQuery";
import {DateTime} from "luxon";
import {FaFlagCheckered, FaMapMarkerAlt} from "react-icons/fa";

const Event = () => {
    const { id } = useParams(); // Récupère l'ID depuis l'URL
    const location = useLocation();
    const event = location.state?.event;
    const endingDate = DateTime.fromFormat(event.ending_date, 'yyyy-MM-dd HH:mm:ss');

    const [lapTimes, setLapTimes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const isLargeScreen = useMediaQuery("(min-width: 1024px)");

    useEffect(() => {
        const fetchLapTimes = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_SEEK_AND_STOCK_API_URL}/events/${id}/results`, {
                    headers: {
                        Authorization: `Bearer ${process.env.REACT_APP_SEEK_AND_STOCK_API_TOKEN}`
                    }
                });
                setLapTimes(response.data);
            } catch (err) {
                setError('Failed to fetch lapTimes');
            } finally {
                setLoading(false);
            }
        };

        fetchLapTimes();
    }, []);

    if (loading) {
        return <Loading>Loading laptimes</Loading>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    function convertTime(seconds) {
        const minutes = Math.floor(seconds / 60); // Nombre entier de minutes
        const remainingSeconds = (seconds % 60).toFixed(3); // Secondes restantes avec 3 décimales

        return `${minutes}.${remainingSeconds}`;
    }
    
    return (
        <>
            <div className="flex mb-5">
                <img src={event.track.image} alt="event image" className="w-44 h-44 bg-neutral-800" />
                <div className="pl-2">
                    <h1 className="text-3xl font-semibold">{event.name}</h1>
                    <div className="flex items-center gap-2">
                        <FaMapMarkerAlt/>
                        <h2 className="text-xl">{event.track.name}</h2>
                    </div>
                    <div className="flex items-center gap-2">
                        <FaFlagCheckered />
                        <span>{endingDate.toFormat("ccc dd LLL yyyy HH:mm")}</span>
                    </div>
                </div>
            </div>
            {isLargeScreen ? <DesktopLapTimeTable lapTimes={lapTimes} convertTime={convertTime}/> :
                <MobileLapTimeTable lapTimes={lapTimes} convertTime={convertTime}/>}
        </>
    );
};

export default Event;
