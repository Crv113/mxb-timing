import './tailwind.css'; 
import './App.css'; 
import Sidebar from "./layouts/Sidebar";
import Home from "./pages/Home";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Events from "./pages/Events";
import Event from "./pages/Event";
import {Settings} from "luxon";
import Test from "./pages/Test";

function App() {
    Settings.defaultLocale = 'en';
  return (
      <BrowserRouter>
          <div className="flex h-screen font-sans">
              <Sidebar />
              <div className="flex-1 sm:p-5 bg-white">
                  <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/test" element={<Test />} />
                      <Route path="/events" element={<Events />} />
                      <Route path="/event/:id" element={<Event />} />
                      <Route path="*" element={<h1>404 - Page Not Found</h1>} />
                  </Routes>
              </div>
          </div>
      </BrowserRouter>
  );
}

export default App;
