import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import EventCard from "../components/EventCard";
import Loading from "../components/Loading";
import Modal from "../components/Modal";
import Button from "../components/Button";
import { AiOutlinePlus } from "react-icons/ai";
import { useAuth } from "../context/AuthContext";
import EventForm from "../components/forms/EventForm";
import {toast} from "react-toastify";

const fetchEvents = async () => {
    const { data } = await axios.get(`${process.env.REACT_APP_SEEK_AND_STOCK_API_URL}/events`, {
        headers: {
            Authorization: `Bearer ${process.env.REACT_APP_SEEK_AND_STOCK_API_TOKEN}`
        }
    });
    return data;
}

const fetchTracks = async () => {
    const { data } = await axios.get(`${process.env.REACT_APP_SEEK_AND_STOCK_API_URL}/tracks`, {
        headers: {
            Authorization: `Bearer ${process.env.REACT_APP_SEEK_AND_STOCK_API_TOKEN}`
        }
    });
    return data;
}

const Events = () => {
    const { isAdmin } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newEvents, setNewEvents] = useState({
        current: [],
        upcoming: [],
        finished: []
    });

    const {
        data: events,
        isLoading: isLoadingEvents,
        isError: isErrorEvents
    } = useQuery({
        queryKey: ['events'],
        queryFn: fetchEvents,
    });

    const {
        data: tracks,
        isLoading: isLoadingTracks,
        isError: isErrorTracks
    } = useQuery({
        queryKey: ['tracks'],
        queryFn: fetchTracks,
    });

    if (isLoadingEvents || isLoadingTracks) return <Loading>Loading data</Loading>;
    if (isErrorEvents || isErrorTracks) return <span>Failed to fetch data</span>;

    const now = new Date();
    const finishedEvents = [...events, ...newEvents.finished].filter(e => new Date(e.ending_date) < now);
    const currentEvents = [...events, ...newEvents.current].filter(e => new Date(e.starting_date) <= now && new Date(e.ending_date) >= now);
    const upcomingEvents = [...events, ...newEvents.upcoming].filter(e => new Date(e.starting_date) > now);

    return (
        <div>
            {isAdmin && (
                <Button icon={AiOutlinePlus} color="primary" className="float-end" onClick={() => setIsModalOpen(true)}>
                    Event
                </Button>
            )}

            <section className="pb-5">
                <h1 className="text-2xl font-outfitMedium text-neutral-950 pb-5">Current Events</h1>
                <ul className="flex gap-6 flex-wrap">
                    {currentEvents.map(event => (
                        <EventCard key={event.id} event={event} status="current" />
                    ))}
                </ul>
            </section>

            <div className="border-t border-neutral-200 mt-2"></div>

            <section className="py-5">
                <h1 className="text-2xl font-outfitMedium text-neutral-950 pb-5">Upcoming Events</h1>
                <ul className="flex gap-6 flex-wrap">
                    {upcomingEvents.map(event => (
                        <EventCard key={event.id} event={event} status="upcoming" />
                    ))}
                </ul>
            </section>

            <div className="border-t border-neutral-200 mt-2"></div>

            <section className="py-5">
                <h1 className="text-2xl font-outfitMedium text-neutral-950 pb-5">Finished Events</h1>
                <ul className="flex gap-6 flex-wrap">
                    {finishedEvents.map(event => (
                        <EventCard key={event.id} event={event} status="finished" />
                    ))}
                </ul>
            </section>

            {isModalOpen && (
                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title="Create Event"
                >
                    <EventForm
                        tracks={tracks}
                        onSuccess={(createdEvent) => {
                            const now = new Date();
                            const category = new Date(createdEvent.starting_date) > now
                                ? "upcoming"
                                : new Date(createdEvent.ending_date) >= now
                                    ? "current"
                                    : "finished";

                            setNewEvents(prev => ({
                                ...prev,
                                [category]: [...prev[category], createdEvent]
                            }));

                            setIsModalOpen(false);
                            toast.info("Event created successfully");
                        }}
                        onCancel={() => setIsModalOpen(false)}
                    />
                </Modal>
            )}
        </div>
    );
};

export default Events;
