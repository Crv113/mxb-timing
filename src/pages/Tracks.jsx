import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loading from "../components/Loading";
import Modal from "../components/Modal";
import Button from "../components/Button";
import {IoCheckmark, IoClose} from "react-icons/io5";
import {AiOutlinePlus} from "react-icons/ai";
import TrackCard from "../components/TrackCard";
import {useAuth} from "../context/AuthContext";
import {getXsrfHeader} from "../utils/xsrfUtils";

const Tracks = () => {
    const {user} = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const { authToken } = useAuth();

    const [tracks, setTracks] = useState([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    
    const [selectedTrack, setSelectedTrack] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        image: null
    });
    
    useEffect(() => {

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
            await fetchTracks();
        })();
        
    }, []);

    const validateForm = () => {
        const errors = {};

        if (!formData.name.trim()) {
            errors.name = "Name is required.";
        }

        if (!formData.image) {
            errors.image = "Image is required.";
        } else {
            if (formData.image.size > process.env.REACT_APP_MAX_FILE_SIZE) {
                const maxFileSizeInMB = (process.env.REACT_APP_MAX_FILE_SIZE / (1024 * 1024)).toFixed(2);
                errors.image = `Max file size allowed: ${maxFileSizeInMB} Mo`;
            }
        }
        
        setFormErrors(errors);

        // Retourne true si aucune erreur, sinon false
        return Object.keys(errors).length === 0;
    };

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        
        if(!validateForm()) {
            return;
        }

        const postData = new FormData();
        postData.append('name', formData.name);
        
        if(formData.image) {
            postData.append('image', formData.image);
        }
        
        try {
            const {data: createdTrack} = await axios.post(`${process.env.REACT_APP_SEEK_AND_STOCK_API_URL}/tracks`, postData, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    ...getXsrfHeader(),
                },
            });

            setTracks((prev) => [...prev, createdTrack]);

            setIsCreateModalOpen(false);
            setFormData({ name: '', image: null });
            setFormErrors({});
        } catch (err) {
            console.error("Error creating track:", err);
        }
        
    };
    
    const handleEditSubmit = async (e) => {
        e.preventDefault();

        const updatedData= new FormData();
        updatedData.append('_method', 'PUT');
        updatedData.append('name', formData.name);
        
        if(formData.image) {
            updatedData.append('image', formData.image);
        }

        try {
            const {data: updatedTrack} = await axios.post(
                `${process.env.REACT_APP_SEEK_AND_STOCK_API_URL}/tracks/${selectedTrack.id}`,
                updatedData,
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                        ...getXsrfHeader()
                    }
                }
            );
            
            setTracks((prev) => 
                prev.map((track) => (track.id === updatedTrack.id ? updatedTrack : track))
            );
            
            setIsEditModalOpen(false);
            setSelectedTrack(null);
            setFormData({name: '', image: null});
        } catch (e) {
            console.error("Error editing track:", e);
        }
    }
    
    const handleTrackClick = (track) => {
        setSelectedTrack(track);
        setFormData({name: track.name, image: null});
        setIsEditModalOpen(true);
    }

    const resetForm = () => {
        setFormData({ name: '', image: null });
        setFormErrors({});
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                setIsCreateModalOpen(false);
                setIsEditModalOpen(false);
                resetForm();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    if (loading) {
        return <Loading>Loading data</Loading>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            
            <section className="pb-5">
                
                {user && <Button icon={AiOutlinePlus} color="primary" onClick={() => setIsCreateModalOpen(true)}>Track</Button>}
                
                <h1 className="text-2xl font-outfitMedium text-neutral-950 pb-5">Tracks</h1>
                <ul className="flex gap-6 flex-wrap justify-center md:justify-normal">
                    {tracks.map(track => (
                        <TrackCard key={track.id} track={track} onClick={() => handleTrackClick(track)}/>
                    ))}
                </ul>
            </section>
            <Modal
                isOpen={isCreateModalOpen}
                onClose={() => {
                    setIsCreateModalOpen(false);
                    resetForm();
                }}
                title="Create Track"
            >
                <form onSubmit={handleCreateSubmit}>
                    <div className="mb-4 flex gap-6">
                        <div className="w-1/2">
                            <label className="block text-neutral-700 text-sm text-nowrap">Name (display in the game)</label>
                            <input
                                type="text"
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="mt-1 w-72 px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-950 text-sm"
                            />
                            {formErrors.name && (
                                <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                            )}
                        </div>
                    </div>
                    <div className="mb-4 flex gap-6">
                        <div className="w-1/2">
                            <label className="block text-neutral-700 text-sm text-nowrap">Image</label>
                            <input
                                type="file"
                                onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                                className="mt-1 w-72 px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-950 text-sm"
                            />
                            {formErrors.image && (
                                <p className="text-red-500 text-xs mt-1 text-nowrap">{formErrors.image}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end gap-4">
                        <Button icon={IoClose} color="secondary" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
                        <Button icon={IoCheckmark} color="primary" type="submit">Create</Button>
                    </div>
                </form>
            </Modal>
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    resetForm();
                }}
                title="Edit Track"
            >
                <form onSubmit={handleEditSubmit}>
                    <div className="mb-4 flex gap-6">
                        <div className="w-1/2">
                            <label className="block text-neutral-700 text-sm text-nowrap">Track name (display in the game)</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="mt-1 w-72 px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-950 text-sm"
                            />
                        </div>
                    </div>
                    <div className="mb-4 flex gap-6">
                        <div className="w-1/2">
                            <label className="block text-neutral-700 text-sm text-nowrap">Image</label>
                            <input
                                type="file"
                                onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                                className="mt-1 w-72 px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-950 text-sm"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-4">
                        <Button icon={IoClose} color="secondary" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                        <Button icon={IoCheckmark} color="primary" type="submit">Save</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Tracks;
