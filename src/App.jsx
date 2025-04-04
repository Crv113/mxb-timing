import './tailwind.css'; 
import './App.css';

import Sidebar from "./layouts/Sidebar";
import Home from "./pages/Home";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Events from "./pages/Events";
import Event from "./pages/Event";
import {Settings} from "luxon";
import Tracks from "./pages/Tracks";
import Profile from "./pages/Profile";
import {AuthProvider} from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {IoMdInformationCircle} from "react-icons/io";
import {useEffect} from "react";

function App() {
    Settings.defaultLocale = 'en';

    useEffect(() => {
        document.title = "Mxb-Timing | Race Against Time";

        const setVh = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };
        setVh();
        window.addEventListener('resize', setVh);
        return () => window.removeEventListener('resize', setVh);
    }, []);
    
  return (
      <AuthProvider>
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <div className="flex font-sans" style={{ height: 'var(--app-height)' }}>
                  <Sidebar />
                  <div className="flex-1 p-5 bg-white mt-10 xl:mt-0 xl:ml-64">
                      <Routes>
                          <Route path="/" element={<Home />} />
                          <Route path="/events" element={<Events />} />
                          <Route path="/tracks" element={<PrivateRoute role="admin">
                              <Tracks />
                          </PrivateRoute> } />
                          <Route path="/profile" element={<Profile />} />
                          <Route path="/event/:id" element={<Event />} />
                          <Route path="*" element={<h1>404 - Page Not Found</h1>} />
                      </Routes>
                      <ToastContainer
                        autoClose={2000}
                        newestOnTop={true}
                        progressClassName="toast-progress-black"
                        icon={<IoMdInformationCircle className="text-xl" />}
                      />
                  </div>
              </div>
          </BrowserRouter>
      </AuthProvider>
  );
}

export default App;
