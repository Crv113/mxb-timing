import {useAuth} from "../../context/AuthContext";
import {Controller, useForm} from "react-hook-form";
import {DateTime} from "luxon";
import axios from "axios";
import DatePicker from "react-datepicker";
import Button from "../Button";
import {IoCheckmark, IoClose} from "react-icons/io5";
import {useMutation} from "@tanstack/react-query";

const createEvent = async ({authToken, postData}) => {
    
    const { data } = await axios.post(
        `${process.env.REACT_APP_SEEK_AND_STOCK_API_URL}/events`,
        postData,
        {
            withCredentials: true,
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        }
    );
    return data;
} 

const EventForm = ({tracks, onSuccess, onCancel}) => {
    const { authToken } = useAuth();
    
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setError,
        control,
        watch
    } = useForm({
        defaultValues: {
            name: "",
            track_id: "",
            starting_date: DateTime.now().startOf("hour").toJSDate(),
            ending_date: null,
            image: null,
        },
    });
    
    const startingDate = watch("starting_date");
    const endingDate = watch("ending_date");
    
    const createEventMutation = useMutation({
        mutationFn: createEvent,
        onSuccess: (createdEvent) => {
            reset();
            onSuccess(createdEvent);
        },
        onError: (error) => {
            console.error("Error creating event:", error);
        }
    })
    
    const onSubmit = async (data) => {
        if (createEventMutation.isPending) return;
        const maxFileSize = Number(process.env.REACT_APP_MAX_FILE_SIZE);
        const image = data.image?.[0];

        if (image && image.size > maxFileSize) {
            setError("image", {
                type: "manual",
                message: `Max file size allowed: ${(maxFileSize / 1024 / 1024).toFixed(2)} Mo`,
            });
            return;
        }

        const postData = new FormData();
        postData.append("name", data.name);
        postData.append("track_id", data.track_id);
        postData.append(
            "starting_date",
            DateTime.fromJSDate(data.starting_date).toFormat("yyyy-MM-dd HH:mm:ss")
        );
        postData.append(
            "ending_date",
            DateTime.fromJSDate(data.ending_date).toFormat("yyyy-MM-dd HH:mm:ss")
        );
        if (image) {
            postData.append("image", image);
        }

        createEventMutation.mutate({authToken, postData});
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4 md:flex gap-6">
                <div className="w-1/2">
                    <label className="block text-neutral-700 text-sm">Name</label>
                    <input
                        type="text"
                        {...register("name", { required: "Name is required." })}
                        className="w-72 px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-950 text-sm"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>

                <div className="w-1/2">
                    <label className="block text-neutral-700 text-sm text-nowrap">Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        {...register("image")}
                        className="mt-1 w-72 px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-950 text-sm"
                    />
                    {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image.message}</p>}
                </div>
            </div>

            <div className="mb-4 gap-6">
                <div className="w-full">
                    <label htmlFor="tracks" className="block text-neutral-700 text-sm">Track</label>
                    <select
                        id="tracks"
                        {...register("track_id", { required: "You must select a track." })}
                        className="w-72 px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-950 text-sm"
                    >
                        <option value="" disabled>Select a track</option>
                        {tracks.map(track => (
                            <option key={track.id} value={track.id}>{track.name}</option>
                        ))}
                    </select>
                    {errors.track_id && <p className="text-red-500 text-xs mt-1">{errors.track_id.message}</p>}
                </div>
            </div>

            <div className="mb-4 md:flex gap-6">
                <div>
                    <label className="block text-neutral-950 mb-2 text-sm">Starting date</label>
                    <Controller
                        control={control}
                        name="starting_date"
                        rules={{ required: "Starting date is required" }}
                        render={({ field }) => (
                            <DatePicker
                                selected={field.value}
                                onChange={field.onChange}
                                showTimeSelect
                                timeFormat="HH:mm"
                                timeIntervals={60}
                                maxDate={endingDate || null}
                                dateFormat="dd/MM/yyyy HH:mm"
                                className="w-72 px-3 py-2 border rounded-lg focus:outline-none focus:border-neutral-950 text-sm"
                            />
                        )}
                    />
                    {errors.starting_date && <p className="text-red-500 text-xs mt-1">{errors.starting_date.message}</p>}
                </div>

                <div>
                    <label className="block text-neutral-950 mb-2 text-sm">Ending date</label>
                    <Controller
                        control={control}
                        name="ending_date"
                        rules={{ required: "Ending date is required" }}
                        render={({ field }) => (
                            <DatePicker
                                selected={field.value}
                                onChange={field.onChange}
                                showTimeSelect
                                timeFormat="HH:mm"
                                timeIntervals={60}
                                minDate={startingDate || null}
                                dateFormat="dd/MM/yyyy HH:mm"
                                className="w-72 px-3 py-2 border rounded-lg focus:outline-none focus:border-neutral-950 text-sm"
                            />
                        )}
                    />
                    {errors.ending_date && <p className="text-red-500 text-xs mt-1">{errors.ending_date.message}</p>}
                </div>
            </div>

            <div className="flex justify-end gap-4">
                <Button icon={IoClose} color="secondary" type="button" onClick={onCancel} disabled={createEventMutation.isPending}>Cancel</Button>
                <Button icon={IoCheckmark} color="primary" type="submit" disabled={createEventMutation.isPending}>
                    {createEventMutation.isPending ? "Creating..." : "Create"}
                </Button>
            </div>
        </form>
    );
}

export default EventForm;