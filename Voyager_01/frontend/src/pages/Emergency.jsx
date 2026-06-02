"use client"

import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import useLiveLocation from "../hooks/useLiveLocation";
import { getUserIdFromToken } from "../utils/jwtUtils";
import { getWhatsappLinkWithTracking } from "../utils/whatsappUtils";
import { AlertCircle, MapPin, ShieldAlert, Heart, RefreshCw, Navigation, MessageCircle, Info, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon1 - lon2);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
    Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const Emergency = () => {
  const {
    location,
    setLocation,
    address,
    setAddress,
    setCurrentcity,
    emergencyContacts,
  } = useAppContext();

  const userId = getUserIdFromToken();
  const { isTracking, startTracking, stopTracking } = useLiveLocation(userId);

  const [loading, setLoading] = useState(true);
  const [nearbyHospitals, setNearbyHospitals] = useState([]);
  const [nearbyPoliceStations, setNearbyPoliceStations] = useState([]);
  const [locationError, setLocationError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const { t } = useTranslation();

  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(userCoords, showError, {
          enableHighAccuracy: false,
          timeout: 15000,
          maximumAge: 0,
        });
      } else {
        setLocationError("Hardware Failure: Geolocation Restricted");
        setLoading(false);
      }
    };
    getLocation();
  }, [retryCount]);

  const userCoords = async (position) => {
    try {
      const userLat = position.coords.latitude;
      const userLng = position.coords.longitude;
      setLocation({ lat: userLat, lng: userLng });
      getNearbyData(userLat, userLng);
      getDetails(userLat, userLng);
      setLocationError(null);
    } catch (err) {
      setLocationError("Coordinate Lock Failed");
    } finally {
      setLoading(false);
    }
  };

  const showError = (error) => {
    let errorMessage = "";
    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorMessage = "Access Restricted: Location Denied";
        break;
      case error.POSITION_UNAVAILABLE:
        errorMessage = "Signal Lost: Position Unavailable";
        break;
      case error.TIMEOUT:
        errorMessage = "Uplink Timeout";
        break;
      default:
        errorMessage = "An Unknown Error Occurred";
    }
    setLocationError(errorMessage);
    setLoading(false);
  };

  const getDetails = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://voyeger2026-backend.onrender.com/api/loc-get-details/reverse-geocode?lat=${lat}&lon=${lng}`
      );
      if (!res.ok) throw new Error("Geocode failed");
      const data = await res.json();
      setAddress(data.address);
      setCurrentcity(data.address?.city || data.address?.town || data.address?.village || "");
    } catch (err) {
      console.error("Address fetch failed:", err);
    }
  };

  const getNearbyData = async (lat, lng) => {
    const long = lng;
    try {
      const res = await fetch(
        "https://voyeger2026-backend.onrender.com/api/emergency/get-nearby-services",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lat, long }),
        }
      );
      if (!res.ok) throw new Error("Failed to fetch nearby services");
      const data = await res.json();
      setNearbyHospitals(data.hospitals);
      setNearbyPoliceStations(data.policeStations);
    } catch (error) {
      console.error("Error fetching nearby services:", error);
    }
  };

  const handleEmergencyContact = async (contactType, phoneNumber) => {
    if (!userId) {
      toast.error("Authentication required for transmission");
      return;
    }
    if (!phoneNumber) {
      toast.error(`Phone record missing for ${contactType}`);
      return;
    }
    try {
      const trackingStarted = startTracking();
      if (trackingStarted) {
        const whatsappUrl = getWhatsappLinkWithTracking(phoneNumber, userId, location?.lat, location?.lng);
        window.open(whatsappUrl, "_blank");
        toast.success(`Broadcasting initiated for ${contactType}`);
      }
    } catch (error) {
      toast.error("Transmission failed");
    }
  };

  const getWhatsappLink = (phone, lat = location?.lat, lng = location?.lng) => {
    if (!phone) return "#";
    const digitsOnly = String(phone).replace(/[^0-9]/g, "");
    const message = `SOS! I need assistance at this location: https://maps.google.com/?q=${lat},${lng}`;
    return `https://wa.me/${digitsOnly}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="w-full bg-white border border-slate-100 overflow-hidden rounded-[4rem] shadow-xl shadow-slate-200/40">
      <div className="p-12 space-y-16">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-[2px] w-12 bg-rose-600" />
              <span className="text-rose-700 font-black uppercase tracking-[0.5em] text-[10px]">Security Protocol Active</span>
            </div>
            <h2 className="text-6xl md:text-8xl font-black text-slate-950 tracking-tighter leading-[0.85]">
              S<span className="text-rose-600">O</span>S <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-orange-600 to-rose-700">CENTRAL</span>
            </h2>
            <p className="text-slate-500 text-lg font-bold italic max-w-lg leading-relaxed">
              "Real-time safety grid synchronized. Tactical emergency protocols standing by for immediate intervention."
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-rose-50 border border-rose-100 px-8 py-5 rounded-[2rem] flex items-center gap-5 shadow-sm">
              <div className="w-2.5 h-2.5 bg-rose-600 rounded-full animate-ping" />
              <span className="text-[10px] font-black text-rose-700 uppercase tracking-[0.3em]">Quantum Grid Lock</span>
            </div>
          </div>
        </div>

        {/* Action HUD: Notify Contacts */}
        <div className="bg-slate-50 rounded-[4rem] p-12 relative overflow-hidden group shadow-inner border border-slate-100">
          <div className="absolute top-0 right-0 w-96 h-96 bg-rose-100/40 blur-[130px] rounded-full pointer-events-none" />

          <div className="relative z-10 space-y-12">
            <div className="flex items-center gap-6">
              <div className="bg-white p-4 rounded-3xl border border-rose-100 shadow-xl shadow-rose-200/20">
                <Heart size={28} className="text-rose-600 fill-current" />
              </div>
              <div>
                <h3 className="text-3xl font-black text-slate-950 uppercase tracking-tight">Direct Kinship Alert</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-2">Satellite Broadcast Protocol</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {["Mom", "Dad", "Friend"].map((type) => {
                const label = type === "Friend" ? "Best Friend" : type;
                const phone = emergencyContacts?.[type.toLowerCase()];
                return (
                  <motion.button
                    key={type}
                    whileHover={{ scale: 1.02, backgroundColor: "#fff" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleEmergencyContact(label, phone)}
                    disabled={isTracking}
                    className={`group/btn p-8 rounded-[3rem] border transition-all duration-500 flex flex-col items-center gap-6 ${isTracking
                        ? "bg-rose-600 border-rose-600 text-white"
                        : "bg-white/50 border-slate-100 text-slate-400 hover:border-rose-300 hover:text-slate-950 shadow-sm"
                      }`}
                  >
                    <div className={`p-4 rounded-2xl transition-all ${isTracking ? "bg-white/20" : "bg-white shadow-inner group-hover/btn:bg-rose-50"}`}>
                      <MessageCircle size={32} className={isTracking ? "text-white" : "text-rose-600"} />
                    </div>
                    <span className="text-xs font-black uppercase tracking-[0.2em]">{isTracking ? "TRANSMITTING..." : type}</span>
                  </motion.button>
                );
              })}
            </div>

            {isTracking && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={stopTracking}
                className="w-full bg-slate-900 text-white py-8 rounded-[3rem] font-black uppercase tracking-[0.3em] text-xs hover:bg-rose-600 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-4"
              >
                Terminate Broadcast <RefreshCw className="animate-spin w-5 h-5" />
              </motion.button>
            )}
          </div>
        </div>

        {/* Location & Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Current Location Viewport */}
          <div className="lg:col-span-12">
            <div className="bg-slate-50 rounded-[4rem] border border-slate-100 p-12 shadow-inner relative group">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-white p-4 rounded-3xl border border-cyan-100 shadow-sm">
                      <MapPin size={28} className="text-cyan-600" />
                    </div>
                    <h3 className="text-4xl font-black text-slate-950 tracking-tighter uppercase">Physical Coordinates</h3>
                  </div>
                  {loading ? (
                    <div className="flex items-center gap-4 text-cyan-700 font-bold italic">
                      <RefreshCw className="animate-spin w-6 h-6" /> Establishing Global Link...
                    </div>
                  ) : locationError ? (
                    <div className="bg-rose-50 text-rose-600 p-6 rounded-3xl border border-rose-100 flex items-center justify-between shadow-sm">
                      <span className="font-black text-xs uppercase tracking-widest">{locationError}</span>
                      <button onClick={() => setRetryCount(r => r + 1)} className="bg-rose-600 text-white p-3 rounded-2xl hover:bg-rose-700 transition-all shadow-lg"><RefreshCw size={16} /></button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-slate-900 text-2xl font-black leading-tight pr-12 border-l-4 border-cyan-500/20 pl-8 italic">
                        {address ? `${address.road || ""}${address.suburb ? ", " + address.suburb : ""}, ${address.city || address.town || ""}, ${address.state || ""}` : "Satellite Lock: Coordinates Only"}
                      </p>
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] ml-8 font-mono">
                        LATITUDE: {location?.lat?.toFixed(6)} | LONGITUDE: {location?.lng?.toFixed(6)}
                      </p>
                    </div>
                  )}
                </div>

                {!loading && !locationError && (
                  <a
                    href={`https://www.google.com/maps?q=${location?.lat},${location?.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white text-slate-950 px-12 py-8 rounded-[2.5rem] font-black uppercase tracking-[0.3em] text-[10px] flex items-center gap-5 hover:bg-slate-900 hover:text-white transition-all shadow-xl shadow-slate-200 border border-slate-100"
                  >
                    Tactical Overlook <Navigation size={20} />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Nearby Support Facilities */}
          <div className="lg:col-span-6 space-y-10">
            <div className="flex items-center gap-4 px-10">
              <ShieldAlert size={20} className="text-rose-600" />
              <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em]">Medical Support Units</h4>
            </div>

            <div className="space-y-6 max-h-[600px] overflow-y-auto pr-6 custom-scrollbar">
              {nearbyHospitals.length > 0 ? (
                nearbyHospitals.map((h, i) => (
                  <div key={i} className="bg-white border border-slate-100 p-10 rounded-[3.5rem] shadow-sm hover:shadow-2xl hover:border-rose-200 transition-all duration-700 group/card">
                    <h5 className="text-2xl font-black text-slate-950 mb-3 group-hover/card:text-rose-600 transition-colors uppercase tracking-tight">{h.name}</h5>
                    <p className="text-slate-500 text-[13px] font-bold italic mb-8 leading-relaxed">"{h.Address || "Data Restricted."}"</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] font-mono">DIST: {h.distanceInMeters?.toFixed(0)}m</span>
                      <a
                        href={getWhatsappLink(h.phone?.[0])}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-slate-50 text-slate-950 px-8 py-4 rounded-2xl border border-slate-100 text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all flex items-center gap-3 shadow-inner hover:shadow-xl"
                      >
                        Establish Link <Zap size={14} />
                      </a>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-slate-50 p-16 rounded-[3.5rem] border border-dashed border-slate-100 text-center opacity-40 italic font-bold">Waiting for sector scan...</div>
              )}
            </div>
          </div>

          <div className="lg:col-span-6 space-y-10">
            <div className="flex items-center gap-4 px-10">
              <AlertCircle size={20} className="text-cyan-600" />
              <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em]">Law Enforcement Grid</h4>
            </div>

            <div className="space-y-6 max-h-[600px] overflow-y-auto pr-6 custom-scrollbar">
              {nearbyPoliceStations.length > 0 ? (
                nearbyPoliceStations.map((p, i) => (
                  <div key={i} className="bg-white border border-slate-100 p-10 rounded-[3.5rem] shadow-sm hover:shadow-2xl hover:border-cyan-200 transition-all duration-700 group/card">
                    <h5 className="text-2xl font-black text-slate-950 mb-3 group-hover/card:text-cyan-600 transition-colors uppercase tracking-tight">{p.name || "Enforcement HUB"}</h5>
                    <p className="text-slate-500 text-[13px] font-bold italic mb-8 leading-relaxed">"{p.Address || "Data Restricted."}"</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] font-mono">DIST: {p.distanceInMeters?.toFixed(0)}m</span>
                      <a
                        href={getWhatsappLink(p.phone?.[0])}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-slate-50 text-slate-950 px-8 py-4 rounded-2xl border border-slate-100 text-[10px] font-black uppercase tracking-widest hover:bg-cyan-600 hover:text-white transition-all flex items-center gap-3 shadow-inner hover:shadow-xl"
                      >
                        Establish Link <Zap size={14} />
                      </a>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-slate-50 p-16 rounded-[3.5rem] border border-dashed border-slate-100 text-center opacity-40 italic font-bold">Waiting for sector scan...</div>
              )}
            </div>
          </div>
        </div>

        {/* Global Awareness Section */}
        <div className="bg-cyan-50 border border-cyan-100 p-12 rounded-[4rem] flex items-center gap-10 shadow-inner relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-100/30 blur-[100px] rounded-full" />
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-cyan-200/20 border border-cyan-50">
            <Info size={40} className="text-cyan-600" />
          </div>
          <div className="space-y-3">
            <h4 className="text-[11px] font-black text-cyan-800 uppercase tracking-[0.6em]">Information Matrix active</h4>
            <p className="text-slate-600 font-bold italic text-lg leading-relaxed max-w-4xl">
              Global emergency services are mapped via tactical proximity sensors. Satellite broadcasting ensures critical data reaches authorized SOS contacts through encrypted quantum channels.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Emergency;
