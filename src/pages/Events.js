import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EventCard from "../components/EventCard";
import Loading from "../components/Loading";

const Events = () => {
    // État pour stocker les données des événements
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [finishedEvents, setFinishedEvents] = useState([]);
    const [currentEvents, setCurrentEvents] = useState([]);
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    
    // Appel API pour récupérer les événements
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_SEEK_AND_STOCK_API_URL}/events`, {
                    headers: {
                        Authorization: `Bearer ${process.env.REACT_APP_SEEK_AND_STOCK_API_TOKEN}`
                    }
                });

                const eventsData = response.data;
                const now = new Date();
                setFinishedEvents(eventsData.filter(event => new Date(event.ending_date) < now));
                setCurrentEvents(eventsData.filter(event => new Date(event.starting_date) <= now && new Date(event.ending_date) >= now));
                setUpcomingEvents(eventsData.filter(event => new Date(event.starting_date) > now));

                // setEvents(response.data);
            } catch (err) {
                setError('Failed to fetch events');
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    if (loading) {
        return <Loading>Loading events</Loading>;
    }

    if (error) {
        return <p>{error}</p>;
    }
    
    return (
        <div className="events-content">
            <section className="pb-5 pt-7">
                <h1 className="text-2xl font-outfitMedium text-slate-700 pb-5">Current Events</h1>
                <ul className="flex gap-6 flex-wrap">
                    {currentEvents.map(event => (
                        <EventCard key={event.id} event={event} status="current"/>
                    ))}
                </ul>
            </section>
            
            <div className="border-t border-slate-200 mt-2"></div>
            
            <section className="py-5">
                <h1 className="text-2xl font-outfitMedium text-slate-700 pb-5">Upcoming Events</h1>
                <ul className="flex gap-6 flex-wrap">
                    {upcomingEvents.map(event => (
                        <EventCard key={event.id} event={event} status="upcoming"/>
                    ))}
                </ul>
            </section>

            <div className="border-t border-slate-200 mt-2"></div>
            
            <section className="py-5">
                <h1 className="text-2xl font-outfitMedium text-slate-700 pb-5">Finished Events</h1>
                <ul className="flex gap-6 flex-wrap">
                    {finishedEvents.map(event => (
                        <EventCard key={event.id} event={event} status="finished"/>
                    ))}
                </ul>
            </section>
        </div>
    );
};

export default Events;
