import React, {useEffect} from "react";
import { useForm } from "react-hook-form";
import Button from "../../components/Button";
import { IoCheckmark, IoClose } from "react-icons/io5";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import {useMutation} from "@tanstack/react-query";

const createTrack = async ({authToken, formData}) => {
    const { data } = await axios.post(
        `${import.meta.env.VITE_SEEK_AND_STOCK_API_URL}/tracks`,
        formData,
        {
            withCredentials: true,
            headers: { Authorization: `Bearer ${authToken}` },
        }
    );
    
    return data;
}

const updateTrack = async ({authToken, id, formData}) => {
    const { data } = await axios.post(
        `${import.meta.env.VITE_SEEK_AND_STOCK_API_URL}/tracks/${id}`,
        formData,
        {
            withCredentials: true,
            headers: { Authorization: `Bearer ${authToken}` },
        }
    );
    
    return data;
}

const TrackForm = ({ initialData = {}, onSuccess, onCancel, isEdit = false }) => {
    const { authToken } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        setError,
    } = useForm({
        defaultValues: {
            name: initialData.name || "",
        }
    });

    // RHF ne met pas à jour les defaultValues si initialData change après le rendu
    // Par sécurité : reset à la main
    useEffect(() => {
        if (initialData?.name) {
            reset({ name: initialData.name });
        }
    }, [initialData?.name, reset]);
    
    const createTrackMutation = useMutation({
        mutationFn: createTrack,
        onSuccess: (createdTrack) => {
            reset();
            onSuccess(createdTrack);
        },
        onError: (error) => {
            console.error("Error creating track:", error);
        }
    })
    
    const updateTrackMutation = useMutation({
        mutationFn: updateTrack,
        onSuccess: (updatedTrack) => {
            reset();
            onSuccess(updatedTrack);
        },
        onError: (error) => {
            console.error("Error updating track:", error);
        }
    })

    const onSubmit = async (data) => {
        if (isSubmitting || updateTrackMutation.isPending || createTrackMutation.isPending) return;
        const maxFileSize = Number(import.meta.env.VITE_MAX_FILE_SIZE);

        const image = data.image?.[0];
        if (image && image.size > maxFileSize) {
            setError("image", {
                type: "manual",
                message: `Max file size allowed: ${(maxFileSize / 1024 / 1024).toFixed(2)} Mo`,
            });
            return;
        }

        const formData = new FormData();
        formData.append("name", data.name);
        
        if (image) formData.append("image", image);
        
        if (isEdit && initialData.id) {
            formData.append("_method", "PUT");
            updateTrackMutation.mutate({authToken, id: initialData.id, formData})
        } else {
            createTrackMutation.mutate({authToken, formData})
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4 flex gap-6">
                <div className="w-1/2">
                    <label className="block text-neutral-700 text-sm text-nowrap">
                        Name (display in the game)
                    </label>
                    <input
                        type="text"
                        {...register("name", { required: "Name is required." })}
                        className="mt-1 w-72 px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-950 text-sm"
                    />
                    {errors.name && (
                        <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                    )}
                </div>
            </div>
            <div className="mb-4 flex gap-6">
                <div className="w-1/2">
                    <label className="block text-neutral-700 text-sm text-nowrap">Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        {...register("image", {
                            validate: (fileList) => {
                                if (!isEdit && (!fileList || fileList.length === 0)) {
                                    return "Image is required.";
                                }
                                return true;
                            },
                        })}
                        className="mt-1 w-72 px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-950 text-sm"
                    />
                    {errors.image && (
                        <p className="text-red-500 text-xs mt-1">{errors.image.message}</p>
                    )}
                </div>
            </div>
            <div className="flex justify-end gap-4">
                <Button
                    icon={IoClose}
                    color="secondary"
                    type="button"
                    onClick={onCancel}
                    disabled={isSubmitting || updateTrackMutation.isPending || createTrackMutation.isPending}
                >
                    Cancel
                </Button>
                <Button icon={IoCheckmark} color="primary" type="submit" disabled={isSubmitting || updateTrackMutation.isPending || createTrackMutation.isPending}>
                    {isSubmitting || updateTrackMutation.isPending || createTrackMutation.isPending
                        ? isEdit ? "Saving..." : "Creating..."
                        : isEdit ? "Save" : "Create"}
                </Button>
            </div>
        </form>
    );
};

export default TrackForm;
