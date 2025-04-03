import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loading from "../components/Loading";
import Modal from "../components/Modal";
import Button from "../components/Button";
import {AiOutlinePlus} from "react-icons/ai";
import TrackCard from "../components/TrackCard";
import TrackForm from "../components/forms/TrackForm";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {toast} from "react-toastify";
const fetchTracks = async () => {
    const { data } = await axios.get(`${process.env.REACT_APP_SEEK_AND_STOCK_API_URL}/tracks`, {
        headers: {
            Authorization: `Bearer ${process.env.REACT_APP_SEEK_AND_STOCK_API_TOKEN}`,
        },
    });
    return data;
};

const Tracks = () => {
    const queryClient = useQueryClient()
    
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedTrack, setSelectedTrack] = useState(null);
    
    const { data: tracks, isLoading, isError } = useQuery({
        queryKey: ['tracks'],
        queryFn: fetchTracks,
    });

    const handleTrackClick = (track) => {
        setSelectedTrack(track);
        setIsEditModalOpen(true);
    }

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                setIsCreateModalOpen(false);
                setIsEditModalOpen(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    if (isLoading) return <Loading>Loading data</Loading>;
    if (isError) return <p>Failed to fetch tracks</p>;

    return (
        <div>
            <section className="pb-5">
                <Button icon={AiOutlinePlus} color="primary" className="float-end" onClick={() => setIsCreateModalOpen(true)}>Track</Button>
                
                <h1 className="text-2xl font-outfitMedium text-neutral-950 pb-5">Tracks</h1>
                <ul className="flex gap-6 flex-wrap justify-center md:justify-normal">
                    {tracks.map(track => (
                        <TrackCard key={track.id} track={track} onClick={() => handleTrackClick(track)}/>
                    ))}
                </ul>
            </section>
            <Modal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="Create Track"
            >
                <TrackForm
                    onSuccess={async () => {
                       await queryClient.invalidateQueries({queryKey: ['tracks']});
                        setIsCreateModalOpen(false);
                        toast.info("Track created successfully");
                        
                    }}
                    onCancel={() => setIsCreateModalOpen(false)}
                />
            </Modal>
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Edit Track"
            >
                <TrackForm
                    initialData={selectedTrack}
                    isEdit={true}
                    onSuccess={async () => {
                        await queryClient.invalidateQueries({queryKey: ['tracks']});
                        setIsEditModalOpen(false);
                        setSelectedTrack(null);
                        toast.info("Track updated successfully");
                    }}
                    onCancel={() => {
                        setIsEditModalOpen(false);
                        setSelectedTrack(null);
                    }}
                />
            </Modal>
        </div>
    );
};

export default Tracks;
