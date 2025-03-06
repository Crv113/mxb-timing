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

function App() {
    Settings.defaultLocale = 'en';
  return (
      <AuthProvider>
          <BrowserRouter>
              <div className="flex h-screen font-sans">
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
                  </div>
              </div>
          </BrowserRouter>
      </AuthProvider>
  );
}

export default App;
