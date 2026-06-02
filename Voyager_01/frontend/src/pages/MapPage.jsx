"use client"

import React, { useEffect, useState } from "react";
import { Search, Map as MapIcon, Navigation, Compass, Star, MapPin, Zap, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Spinner = () => (
  <div className="flex flex-col justify-center items-center h-[500px] gap-8 bg-[#0a0a0c] rounded-[4rem] border border-white/5 relative overflow-hidden">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(8,145,178,0.1)_0%,transparent_70%)]" />
    <div className="relative">
      <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-cyan-500 shadow-[0_0_30px_rgba(8,145,178,0.3)]"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-12 h-12 bg-cyan-500 rounded-full blur-md opacity-20" />
      </div>
    </div>
    <span className="text-[11px] font-black text-cyan-400 capitalize tracking-[0.6em] animate-pulse">Establishing Tactical Coordinate Lock...</span>
  </div>
);

const MapPage = () => {
  const [coords, setCoords] = useState(null);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [touristSpots, setTouristSpots] = useState([]);
  const [spotsLoading, setSpotsLoading] = useState(false);
  const [spotsError, setSpotsError] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("HARDWARE INCOMPATIBILITY: GPS MODULE DISABLED");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ lat: latitude, lng: longitude });
      },
      (err) => {
        setError("SIGNAL ACQUISITION FAILURE: ACCESS DENIED");
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  }, []);

  useEffect(() => {
    if (search.length < 3) {
      setSuggestions([]);
      return;
    }
    setSearchLoading(true);
    const controller = new AbortController();
    fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(search)}&addressdetails=1&limit=5`,
      { signal: controller.signal }
    )
      .then((res) => res.json())
      .then((data) => {
        setSuggestions(data);
        setSearchLoading(false);
      })
      .catch(() => setSearchLoading(false));
    return () => controller.abort();
  }, [search]);

  useEffect(() => {
    if (!coords) return;
    setSpotsLoading(true);
    const controller = new AbortController();
    const overpassQuery = `
      [out:json][timeout:25];
      (
        node["tourism"]["wikidata"](around:15000,${coords.lat},${coords.lng});
        way["tourism"]["wikidata"](around:15000,${coords.lat},${coords.lng});
        relation["tourism"]["wikidata"](around:15000,${coords.lat},${coords.lng});
      );
      out center;
    `;
    fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`, { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        const spots = data.elements
          .filter((element) => element.tags && element.tags.name)
          .map((element) => ({
            id: element.id,
            name: element.tags.name,
            lat: element.lat || element.center?.lat,
            lon: element.lon || element.center?.lon,
          }))
          .filter((spot, index, self) => index === self.findIndex((s) => s.name === spot.name))
          .slice(0, 15);
        setTouristSpots(spots);
        setSpotsLoading(false);
      })
      .catch(() => setSpotsLoading(false));
    return () => controller.abort();
  }, [coords]);

  const handleSuggestionClick = (suggestion) => {
    setCoords({ lat: parseFloat(suggestion.lat), lng: parseFloat(suggestion.lon) });
    setSearch("");
    setSuggestions([]);
  };

  return (
    <div className="w-full bg-[#0a0a0c]/80 backdrop-blur-2xl border border-white/5 overflow-hidden rounded-[4rem] shadow-2xl">
      <div className="p-12 space-y-12">
        {/* Search HUD */}
        <div className="relative z-50">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="relative flex-1 group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 w-5 h-5 group-focus-within:text-cyan-400 transition-colors" />
              <input
                type="text"
                className="w-full bg-white/5 border border-white/10 rounded-[2rem] py-6 pl-16 pr-6 text-white placeholder:text-white/20 font-bold text-sm tracking-widest focus:bg-white/10 focus:ring-0 outline-none transition-all shadow-inner"
                placeholder="INPUT STRATEGIC TARGET COORDINATES..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoComplete="off"
              />
              {searchLoading && (
                <div className="absolute right-8 top-1/2 -translate-y-1/2 w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
              )}
            </div>

            <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-8 py-4 rounded-[2rem]">
              <div className="w-2.5 h-2.5 bg-cyan-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(8,145,178,0.5)]" />
              <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Quantum Sat-Lock Active</span>
            </div>
          </div>

          <AnimatePresence>
            {suggestions.length > 0 && (
              <motion.ul
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute top-full left-0 right-0 bg-[#0a0a0c]/90 border border-white/10 rounded-[2.5rem] mt-6 shadow-2xl overflow-hidden max-h-[400px] overflow-y-auto z-[60] p-3 backdrop-blur-3xl"
              >
                {suggestions.map((s) => (
                  <li
                    key={s.place_id}
                    className="px-8 py-6 cursor-pointer hover:bg-white/5 text-xs font-black text-white/40 hover:text-white border-b border-white/5 last:border-none transition-all flex items-center gap-6 group"
                    onClick={() => handleSuggestionClick(s)}
                  >
                    <div className="bg-cyan-500/10 p-3 rounded-2xl border border-cyan-500/20 group-hover:bg-cyan-500 transition-all">
                      <MapIcon size={18} className="text-cyan-400 group-hover:text-white" />
                    </div>
                    <span className="uppercase tracking-tight leading-relaxed">{s.display_name}</span>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>

        {/* Notables HUD */}
        <div className="space-y-8 bg-white/5 border border-white/10 p-10 rounded-[3.5rem] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[100px] rounded-full" />

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="bg-cyan-500/10 p-2.5 rounded-xl border border-cyan-500/20">
                <Star size={18} className="text-cyan-400 fill-cyan-400" />
              </div>
              <h3 className="text-[11px] font-black text-white/40 uppercase tracking-[0.5em]">Nearby Tactical Interests</h3>
            </div>
            <span className="text-[9px] font-black text-white/10 uppercase tracking-widest font-mono">SECTOR: {coords ? `${coords.lat.toFixed(2)}N / ${coords.lng.toFixed(2)}E` : "SCANNING..."}</span>
          </div>

          <div className="flex overflow-x-auto gap-5 pb-4 custom-scrollbar scroll-smooth">
            {spotsLoading ? (
              Array(6).fill(0).map((_, i) => (
                <div key={i} className="h-16 w-56 bg-white/5 border border-white/5 rounded-[2rem] animate-pulse shrink-0" />
              ))
            ) : (
              touristSpots.map((spot) => (
                <motion.button
                  key={spot.id}
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.05)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCoords({ lat: spot.lat, lng: spot.lon })}
                  className="whitespace-nowrap bg-white/5 border border-white/10 px-8 py-5 rounded-[2.5rem] text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-white transition-all shadow-xl flex items-center gap-4 shrink-0 group/spot"
                >
                  <Navigation size={16} className="text-cyan-500 group-hover/spot:rotate-45 transition-transform duration-500" />
                  {spot.name}
                </motion.button>
              ))
            )}
            {!spotsLoading && touristSpots.length === 0 && (
              <div className="w-full text-center py-4 bg-white/5 rounded-2xl border border-dashed border-white/10 opacity-40 italic font-bold">No strategic targets identified in this radius.</div>
            )}
          </div>
        </div>

        {/* Map HUD Viewport Container */}
        <div className="aspect-[21/9] w-full rounded-[4.5rem] overflow-hidden border-8 border-white/5 shadow-2xl relative bg-black group">
          <AnimatePresence mode="wait">
            {error ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 flex flex-col items-center justify-center p-16 text-center"
              >
                <div className="bg-rose-500/10 border border-rose-500/20 p-12 rounded-[4rem] shadow-2xl relative">
                  <div className="absolute inset-0 bg-rose-500/5 blur-3xl rounded-full" />
                  <p className="text-rose-400 font-black uppercase tracking-[0.6em] text-[10px] mb-6">UPlink Malfunction</p>
                  <p className="text-white font-black italic text-xl leading-relaxed whitespace-pre-line tracking-tight">{error}</p>
                </div>
              </motion.div>
            ) : coords ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative w-full h-full"
              >
                <iframe
                  key={`${coords.lat}-${coords.lng}`}
                  className="w-full h-full grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000"
                  src={`https://maps.google.com/maps?q=${coords.lat},${coords.lng}&z=14&output=embed&t=p`}
                  allowFullScreen
                  loading="lazy"
                  title="Tactical Surface Radar"
                />
                <div className="absolute inset-0 pointer-events-none border-[30px] border-[#0a0a0c]/40 mix-blend-multiply" />
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_40%,rgba(10,10,12,0.8)_100%)]" />
              </motion.div>
            ) : (
              <Spinner />
            )}
          </AnimatePresence>

          {/* Tactical HUD Overlay Elements */}
          <div className="absolute top-12 left-12 pointer-events-none flex flex-col gap-4">
            <div className="bg-[#0a0a0c]/80 backdrop-blur-2xl px-6 py-3.5 rounded-[2rem] border border-white/5 flex items-center gap-4 shadow-2xl">
              <div className="relative w-3 h-3">
                <div className="absolute inset-0 bg-cyan-500 rounded-full animate-ping opacity-40" />
                <div className="absolute inset-0 bg-cyan-400 rounded-full" />
              </div>
              <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">Satellite Uplink Verified</span>
            </div>

            <div className="bg-black/40 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/5 flex items-center gap-3">
              <Shield size={14} className="text-emerald-500" />
              <span className="text-[9px] font-black text-white/20 uppercase tracking-widest font-mono">Secure Stream Encrypted</span>
            </div>
          </div>

          <div className="absolute bottom-12 right-12 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-6 group-hover:translate-y-0">
            <div className="bg-cyan-500/10 text-cyan-400 px-8 py-5 rounded-3xl border border-cyan-500/30 flex items-center gap-5 shadow-2xl backdrop-blur-3xl">
              <div className="bg-cyan-500 p-2 rounded-xl">
                <Compass size={20} className="text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Locked on Grid</span>
                <span className="text-[9px] font-black uppercase tracking-widest text-white/40 font-mono">Target: {coords ? `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}` : "---"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;