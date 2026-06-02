import React from "react";
import HeroSection from "../components/HeroSection";
import Testimonials from "../components/Testimonials";
import BookingSection from "../components/BookingSection";
import MapPage from "./MapPage";
import WeatherApp from "./Weather";
import Emergency from "./Emergency";
import DestinationSlider from "./DestinationSlider";
import Community from "../pages/Community";
import { useAppContext } from "../context/AppContext";
import CreatePost from "./CreatePost";

const Home = () => {
  const { createCom, setCreateCom } = useAppContext();
  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-cyan-500/30 overflow-x-hidden">
      {/* Universal Background Ambiance (Cosmic Mode) */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] right-[-5%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] left-[-5%] w-[50%] h-[50%] bg-indigo-600/10 blur-[120px] rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(8,145,178,0.05)_0%,transparent_70%)]" />
      </div>

      <div className="relative z-10">
        <HeroSection />

        <div className="max-w-[1440px] mx-auto space-y-32 py-32">
          <DestinationSlider />
          <Community />
          <MapPage />
          <WeatherApp />
          <Emergency />
        </div>

        {createCom && <CreatePost />}
      </div>
    </div>
  );
};

export default Home;
