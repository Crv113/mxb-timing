import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {useParams} from "react-router-dom";
import Loading from "../components/Loading";
import DesktopLapTimeTable from "../components/DesktopLapTimeTable";
import MobileLapTimeTable from "../components/MobileLapTimeTable";
import useMediaQuery from "../hooks/useMediaQuery";

const Event = () => {
    const { id } = useParams(); // Récupère l'ID depuis l'URL
    // État pour stocker les données des événements
    const [lapTimes, setLapTimes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const isLargeScreen = useMediaQuery("(min-width: 1024px)");
    // Appel API pour récupérer les événements
    useEffect(() => {
        const fetchLapTimes = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_SEEK_AND_STOCK_API_URL}/events/${id}/results`, {
                    headers: {
                        Authorization: `Bearer ${process.env.REACT_APP_SEEK_AND_STOCK_API_TOKEN}`
                    }
                });
                console.log(response.data)
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
        isLargeScreen ? <DesktopLapTimeTable lapTimes={lapTimes} convertTime={convertTime} /> : <MobileLapTimeTable  lapTimes={lapTimes} convertTime={convertTime} />
    );
};

export default Event;
