import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

// Import marker images for Leaflet icon fix
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const TrackLocationPage = () => {
  const { userId } = useParams();

  // State
  const [location, setLocation] = useState(null);
  const [viewerLocation, setViewerLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRoute, setShowRoute] = useState(false);
  const [distance, setDistance] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [trackingExpired, setTrackingExpired] = useState(false);

  // Refs
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const trackedMarkerRef = useRef(null);
  const viewerMarkerRef = useRef(null);
  const routingControlRef = useRef(null);
  const intervalRef = useRef(null);
  const viewerWatchId = useRef(null);

  // --- Helper: Calculate Distance ---
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(2);
  };

  // --- Leaflet Icon Fix ---
  useEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: markerIcon2x,
      iconUrl: markerIcon,
      shadowUrl: markerShadow,
    });
  }, []);

  // --- Viewer Live Tracking (You) ---
  const startLiveTrackingMe = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    if (viewerWatchId.current) navigator.geolocation.clearWatch(viewerWatchId.current);

    viewerWatchId.current = navigator.geolocation.watchPosition(
      (position) => {
        const coords = [position.coords.latitude, position.coords.longitude];
        setViewerLocation(coords);

        if (mapRef.current) {
          if (viewerMarkerRef.current) {
            viewerMarkerRef.current.setLatLng(coords);
          } else {
            const viewerIcon = L.divIcon({
              className: "custom-div-icon",
              html: `<div style="background-color: #3b82f6; width: 18px; height: 18px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 15px rgba(59, 130, 246, 0.5); position: relative;">
                      <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: #3b82f6; border-radius: 50%; animation: pulse 2s infinite; opacity: 0.5;"></div>
                    </div>`,
              iconSize: [18, 18],
              iconAnchor: [9, 9],
            });
            viewerMarkerRef.current = L.marker(coords, { icon: viewerIcon }).addTo(mapRef.current);
            viewerMarkerRef.current.bindPopup("You are here").openPopup();
          }
          // Only auto-center on first find
          if (!viewerLocation) mapRef.current.setView(coords, 14);
        }
      },
      (error) => console.error(error),
      { enableHighAccuracy: true }
    );
  };

  // --- Target Polling (Them) ---
  const fetchTrackedLocation = async () => {
    try {
      const response = await fetch(`https://voyeger2026-backend.onrender.com/api/location/${userId}`);
      if (response.status === 404) {
        setTrackingExpired(true);
        setLoading(false);
        return;
      }
      const data = await response.json();
      if (data.success && data.data) {
        setLocation(data.data);
        setLastUpdated(new Date(data.data.updatedAt));

        if (mapRef.current) {
          const pos = [data.data.latitude, data.data.longitude];
          if (trackedMarkerRef.current) {
            trackedMarkerRef.current.setLatLng(pos);
          } else {
            trackedMarkerRef.current = L.marker(pos).addTo(mapRef.current);
            trackedMarkerRef.current.bindPopup(`<b>Target: ${userId}</b>`).openPopup();
            mapRef.current.setView(pos, 15);
          }
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // --- Routing Logic ---
  useEffect(() => {
    if (!mapRef.current || !showRoute || !location || !viewerLocation) {
      if (routingControlRef.current) {
        mapRef.current.removeControl(routingControlRef.current);
        routingControlRef.current = null;
      }
      return;
    }

    const start = L.latLng(viewerLocation[0], viewerLocation[1]);
    const end = L.latLng(location.latitude, location.longitude);

    if (routingControlRef.current) {
      routingControlRef.current.setWaypoints([start, end]);
    } else {
      routingControlRef.current = L.Routing.control({
        waypoints: [start, end],
        lineOptions: { styles: [{ color: "#3b82f6", weight: 6, opacity: 0.8 }] },
        createMarker: () => null,
        addWaypoints: false,
        draggableWaypoints: false,
        fitSelectedRoutes: true,
        show: false,
      }).addTo(mapRef.current);
    }

    setDistance(calculateDistance(viewerLocation[0], viewerLocation[1], location.latitude, location.longitude));
  }, [showRoute, location, viewerLocation]);

  // --- Init & Cleanup ---
  useEffect(() => {
    if (loading || trackingExpired || mapRef.current || !mapContainerRef.current) return;
    mapRef.current = L.map(mapContainerRef.current).setView([0, 0], 2);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "© OpenStreetMap" }).addTo(mapRef.current);
    setTimeout(() => mapRef.current.invalidateSize(), 250);
  }, [loading, trackingExpired]);

  useEffect(() => {
    if (!userId) return;
    fetchTrackedLocation();
    intervalRef.current = setInterval(fetchTrackedLocation, 5000);
    return () => {
      clearInterval(intervalRef.current);
      if (viewerWatchId.current) navigator.geolocation.clearWatch(viewerWatchId.current);
    };
  }, [userId]);

  if (loading) return <div className="h-screen flex items-center justify-center font-bold text-slate-400">CONNECTING...</div>;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(2.5); opacity: 0; }
        }
      `}</style>

      <header className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-[1001] px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black italic">V</div>
            <h1 className="text-xl font-black text-slate-800 tracking-tighter uppercase">Voyager.Live</h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={startLiveTrackingMe}
              className="px-4 py-2 bg-slate-900 text-white rounded-full text-xs font-bold hover:bg-slate-700 transition-all shadow-lg"
            >
              📍 START LIVE TRACKING ME
            </button>
            {viewerLocation && (
              <button
                onClick={() => setShowRoute(!showRoute)}
                className={`px-4 py-2 rounded-full text-xs font-bold border transition-all shadow-lg ${showRoute ? "bg-red-500 text-white border-red-600" : "bg-white text-slate-900 border-slate-200"}`}
              >
                {showRoute ? "STOP ROUTE" : "DRAW ROUTE"}
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow p-4 md:p-6 max-w-7xl mx-auto w-full space-y-4">
        <div className="relative bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border-8 border-white h-[60vh] md:h-[70vh]">
          <div ref={mapContainerRef} className="w-full h-full z-0" />
          <div className="absolute top-6 left-6 z-[1000] bg-white/90 backdrop-blur-sm p-4 rounded-3xl border border-slate-100 shadow-xl space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-black text-slate-600 uppercase">Tracker (You)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-slate-800 rounded-sm"></div>
              <span className="text-[10px] font-black text-slate-600 uppercase">Target (User)</span>
            </div>
            {distance && showRoute && (
              <div className="pt-2 border-t mt-2">
                <span className="text-[10px] text-slate-400 block uppercase">Gap</span>
                <span className="text-lg font-black text-blue-600 tracking-tight">{distance} KM</span>
              </div>
            )}
          </div>
        </div>

        {location && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Position</label>
              <p className="text-xl font-mono text-slate-800 font-bold mt-1">
                {location.latitude.toFixed(6)}° N, {location.longitude.toFixed(6)}° E
              </p>
            </div>
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200 flex justify-between items-center">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Signal Status</label>
                <p className="text-xl text-slate-800 font-bold mt-1">{lastUpdated?.toLocaleTimeString()}</p>
              </div>
              <div className="px-3 py-1 bg-green-50 rounded-full flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
                <span className="text-[10px] font-bold text-green-600 uppercase">Live</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default TrackLocationPage;