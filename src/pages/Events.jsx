import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EventCard from "../components/EventCard";
import Loading from "../components/Loading";
import Modal from "../components/Modal";
import Button from "../components/Button";
import {IoCheckmark, IoClose} from "react-icons/io5";
import {AiOutlinePlus} from "react-icons/ai";
import DatePicker from "react-datepicker";
import {DateTime} from "luxon";
import {useAuth} from "../context/AuthContext";

const Events = () => {
    const { isAdmin, authToken } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formErrors, setFormErrors] = useState({});

    const [finishedEvents, setFinishedEvents] = useState([]);
    const [currentEvents, setCurrentEvents] = useState([]);
    const [upcomingEvents, setUpcomingEvents] = useState([]);

    const [tracks, setTracks] = useState([]);
    
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [startingDate, setStartDate] = useState(DateTime.now().startOf("hour").toJSDate());
    const [endingDate, setEndDate] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        track_id: '',
    });
    
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const {data: eventsData} = await axios.get(`${process.env.REACT_APP_SEEK_AND_STOCK_API_URL}/events`, {
                    headers: {
                        Authorization: `Bearer ${process.env.REACT_APP_SEEK_AND_STOCK_API_TOKEN}`
                    }
                });

                const now = new Date();
                setFinishedEvents(eventsData.filter(event => new Date(event.ending_date) < now));
                setCurrentEvents(eventsData.filter(event => new Date(event.starting_date) <= now && new Date(event.ending_date) >= now));
                setUpcomingEvents(eventsData.filter(event => new Date(event.starting_date) > now));

            } catch (err) {
                setError('Failed to fetch events');
            } finally {
                setLoading(false);
            }
        };

        const fetchTracks = async () => {
            try {
                const {data: fetchedTracks} = await axios.get(`${process.env.REACT_APP_SEEK_AND_STOCK_API_URL}/tracks`, {
                    headers: {
                        Authorization: `Bearer ${process.env.REACT_APP_SEEK_AND_STOCK_API_TOKEN}`
                    }
                });

                setTracks(fetchedTracks);
            } catch (err) {
                setError('Failed to fetch tracks');
            } finally {
                setLoading(false);
            }
        };

        (async () => {
            await fetchEvents();
            await fetchTracks();
        })();
        
    }, []);

    const validateForm = () => {
        const errors = {};
        
        if (!formData.name.trim()) {
            errors.name = "Name is required.";
        }

        if (!formData.track_id) {
            errors.track_id = "You must select a track.";
        }
        
        if(!startingDate) {
            errors.starting_date = "Starting date is required";
        }
        
        if(!endingDate) {
            errors.ending_date = "Ending date is required";
        }
        
        if (formData.image && formData.image.size > process.env.REACT_APP_MAX_FILE_SIZE) {
            const maxFileSizeInMB = (process.env.REACT_APP_MAX_FILE_SIZE / (1024 * 1024)).toFixed(2);
            errors.image = `Max file size allowed: ${maxFileSizeInMB} Mo`;
        }

        setFormErrors(errors);

        // Retourne true si aucune erreur, sinon false
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if(!validateForm()) {
            return;
        }

        const postData = new FormData();
        postData.append('name', formData.name);
        postData.append('track_id', formData.track_id);
        postData.append('starting_date', DateTime.fromJSDate(startingDate).toFormat("yyyy-MM-dd HH:mm:ss"));
        postData.append('ending_date', DateTime.fromJSDate(endingDate).toFormat("yyyy-MM-dd HH:mm:ss"));
        
        if(formData.image) {
            postData.append('image', formData.image);
        }
        
        try {
            console.log('authToken Create event')
            console.log(authToken)
            const {data: createdEvent} = await axios.post(`${process.env.REACT_APP_SEEK_AND_STOCK_API_URL}/events`, postData, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${authToken}`,
                }
            });

            const now = new Date();
            if (new Date(createdEvent.starting_date) > now) {
                setUpcomingEvents((prev) => [...prev, createdEvent]);
            } else if (
                new Date(createdEvent.starting_date) <= now &&
                new Date(createdEvent.ending_date) >= now
            ) {
                setCurrentEvents((prev) => [...prev, createdEvent]);
            } else {
                setFinishedEvents((prev) => [...prev, createdEvent]);
            }

            setIsModalOpen(false);
            setFormData({ name: '', track_id: '' });
            setFormErrors({});
            setStartDate(DateTime.now().startOf("hour").toJSDate());
            setEndDate(null);
        } catch (err) {
            console.error("Error creating event:", err);
        }
        
    };

    if (loading) {
        return <Loading>Loading data</Loading>;
    }

    if (error) {
        return <span>{error}</span>;
    }

    return (
        <div className="events-content">

            {isAdmin && <Button icon={AiOutlinePlus} color="primary" className="float-end" onClick={() => setIsModalOpen(true)}>Event</Button>}
            
            
            <section className="pb-5">
                <h1 className="text-2xl font-outfitMedium text-neutral-950 pb-5">Current Events</h1>
                <ul className="flex gap-6 flex-wrap">
                    {currentEvents.map(event => (
                        <EventCard key={event.id} event={event} status="current"/>
                    ))}
                </ul>
            </section>
            
            <div className="border-t border-neutral-200 mt-2"></div>
            
            <section className="py-5">
                <h1 className="text-2xl font-outfitMedium text-neutral-950 pb-5">Upcoming Events</h1>
                <ul className="flex gap-6 flex-wrap">
                    {upcomingEvents.map(event => (
                        <EventCard key={event.id} event={event} status="upcoming"/>
                    ))}
                </ul>
            </section>

            <div className="border-t border-neutral-200 mt-2"></div>
            
            <section className="py-5">
                <h1 className="text-2xl font-outfitMedium text-neutral-950 pb-5">Finished Events</h1>
                <ul className="flex gap-6 flex-wrap">
                    {finishedEvents.map(event => (
                        <EventCard key={event.id} event={event} status="finished"/>
                    ))}
                </ul>
            </section>

            {isModalOpen &&
                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title="Create Event"
                >
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4 md:flex gap-6">
                            <div className="w-1/2">
                                <label className="block text-neutral-700 text-sm">Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-72 px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-950 text-sm"
                                />
                                {formErrors.name && (
                                    <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                                )}
                            </div>
                            <div className="w-1/2">
                                <label className="block text-neutral-700 text-sm text-nowrap">Image</label>
                                <input
                                    type="file"
                                    onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                                    className="mt-1 w-72 px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-950 text-sm"
                                />
                                {formErrors.image && (
                                    <p className="text-red-500 text-xs mt-1">{formErrors.image}</p>
                                )}
                            </div>
                        </div>
                        <div className="mb-4 gap-6">
                            <div className="w-full">
                                <label htmlFor="tracks" className="block text-neutral-700 text-sm">Track</label>
                                <select
                                    id="tracks"
                                    value={ formData.track_id || ""}
                                    onChange={(e) => {
                                        setFormData({...formData, track_id: e.target.value});
                                    }}
                                    className="w-72 px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-950 text-sm"
                                >
                                    <option value="" disabled>
                                        Select a track
                                    </option>
                                    {tracks.map(track => (
                                        <option key={track.id} value={track.id}>{track.name}</option>
                                    ))}
                                </select>
                                {formErrors.track_id && (
                                    <p className="text-red-500 text-xs mt-1">{formErrors.track_id}</p>
                                )}
                            </div>
                        </div>
                        <div className="mb-4 md:flex gap-6">
                            <div>
                                <label className="block text-neutral-950 mb-2 text-sm">Starting date</label>
                                <DatePicker
                                    selected={startingDate}
                                    placeholderText="Choisir une date"
                                    onChange={(date) => setStartDate(date)}
                                    showTimeSelect
                                    timeFormat="HH:mm"
                                    timeIntervals={60}
                                    dateFormat="dd/MM/yyyy HH:mm"
                                    maxDate={endingDate}
                                    className="w-72 px-3 py-2 border rounded-lg focus:outline-none focus:border-neutral-950 text-sm"
                                />
                                {formErrors.starting_date && (
                                    <p className="text-red-500 text-xs mt-1">{formErrors.starting_date}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-neutral-950 mb-2 text-sm">Ending date</label>
                                <DatePicker
                                    selected={endingDate}
                                    onChange={(date) => setEndDate(date)}
                                    showTimeSelect
                                    timeFormat="HH:mm"
                                    timeIntervals={60}
                                    dateFormat="dd/MM/yyyy HH:mm"
                                    minDate={startingDate}
                                    className="w-72 px-3 py-2 border rounded-lg focus:outline-none focus:border-neutral-950 text-sm"
                                />
                                {formErrors.ending_date && (
                                    <p className="text-red-500 text-xs mt-1">{formErrors.ending_date}</p>
                                )}
                            </div>
                        </div>
                        <div className="flex justify-end gap-4">
                            <Button icon={IoClose} color="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                            <Button icon={IoCheckmark} color="primary" type="submit">Create</Button>
                        </div>
                    </form>
                </Modal>
            }
        </div>
    );
};

export default Events;
