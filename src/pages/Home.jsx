import React from 'react';
import {IoIosWarning} from "react-icons/io";

const Home = () => {
    return (
        <div className="md:p-10">
            <div className="lg:flex lg:flex-row lg:justify-between">
                <div className="flex flex-col lg:w-1/2 lg:justify-center">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-outfitBlack mb-4 lg:mb-6">Welcome to MXB Timing</h1>
                    <p className="font-outfitRegular mb-4 lg:mb-6 md:text-lg">
                        Love the competitiveness of MX Bikes but can’t make it to the evening races? <br/>
                        You’re in the right place! <br />
                        On MXB Timing, you can join an event and set your best lap times on our server before the event deadline — and try to be the fastest and win the event!
                    </p>
                    <span className="flex flex-row items-center bg-orange-100 w-fit py-1 px-4 rounded-2xl text-xs font-outfitSemiBold">
                        <IoIosWarning className="text-orange-400 mr-2 text-lg" />
                        MXB Timing is still in Alpha
                    </span>
                </div>
                
                <div className="flex justify-center my-10 lg:w-1/2">
                    <img
                        src="/home.png"
                        alt="MXB Timing Visual"
                        className="max-w-lg w-full h-auto"
                    />
                </div>
            </div>
            <div className="lg:flex lg:flex-row-reverse lg:justify-between mt-6">
                <div className="flex flex-col lg:w-1/2 lg:justify-center">
                    <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-outfitBlack mb-4 lg:mb-6">How it work's</h1>
                    <p className="font-outfitRegular mb-4 lg:mb-6 md:text-lg">
                        If you haven’t already, log in with Discord on our website and add your GUID to your profile.
                        <br/>
                        Check if there is an ongoing event.
                        If you’ve already set a lap time, it will appear — if not, go ride on mxbtiming.com on the event track!
                    </p>
                </div>
    
                <div className="flex my-10 lg:w-1/2">
                    <img
                        src="/home2.png"
                        alt="MXB Timing Visual"
                        className="max-w-lg w-full h-auto"
                    />
                </div>
            </div>
            <div className="mt-6">
                <div className="flex flex-col lg:justify-center">
                    <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-outfitBlack mb-4 lg:mb-6">What's next ?</h1>
                    <div className="font-outfitRegular mb-4 lg:mb-6 md:text-lg">
                        MXB Timing is a hobby project developed by a single person. 
                        Many features are still missing to make the experience more enjoyable, which is why it's currently only in Alpha.
                        <br/>
                        <br/>
                        Here are some of the planned features for the future:
                        <br/>
                        <ul className="list-disc list-inside space-y-2">
                            <li><del>Retrieve lap times from an Open Practice session to avoid restarts and waiting for a race to end.</del> - DONE ✅</li>
                            <li>Add player statistics.</li>
                            <li>Create event duo.</li>
                            <li>Implement a voting system to choose the track for upcoming events.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
