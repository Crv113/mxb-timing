import React from 'react';
import {IoIosWarning} from "react-icons/io";

const Home = () => {
    return (
        <div className="">
            <div className="w-full flex flex-col items-center">
                <img src="/mxbt.png" alt="logo mxb timing" className="w-48 mb-4"/>
            </div>

          <div className="lg:flex lg:flex-row lg:justify-between">
            <div className="mb-4 flex flex-col lg:w-1/2 lg:justify-center">
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-outfitBlack mb-4 lg:mb-6">Welcome to MXB Timing</h1>
                <p className="font-outfitRegular mb-4 lg:mb-6 md:text-lg">
                    Love the competitiveness of MX Bikes but can’t make it to the evening races? <br/>
                    You’re in the right place! <br />
                    On MXB Timing, you can join an event and set your best lap times on our server before the event deadline — and try to be the fastest!
                </p>
                <span className="flex flex-row items-center bg-orange-100 w-fit py-1 px-4 rounded-2xl text-xs font-outfitSemiBold">
                    <IoIosWarning className="text-orange-400 mr-2 text-lg" />
                    MXB Timing is still in Alpha
                </span>
                
            </div>

            <div className="flex justify-center lg:w-1/2">
                <img
                    src="/home.png"
                    alt="MXB Timing Visual"
                    className="max-w-lg w-full h-auto"
                />
            </div>
          </div>
        </div>
    );
};

export default Home;
