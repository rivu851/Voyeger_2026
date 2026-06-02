import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Search, MapPin, Wind, Droplets, Thermometer, Sun, CloudRain, Zap, Cloud, Snowflake, Navigation2, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function getEvidenceBasedPacking({ temp, uvIndex, rainfall }) {
  let items = [];
  if (typeof temp === 'number') {
    if (temp < -10) items.push("Thermal layer-01", "Insulated boots", "Heavy combat coat");
    else if (temp >= -10 && temp < 0) items.push("Tactical scarf", "Thermal gloves", "Waterproof boots");
    else if (temp >= 0 && temp < 10) items.push("Synthetic jacket", "Reinforced pants", "Thermal buffer");
    else if (temp >= 10 && temp < 30) items.push("Lightweight suit", "Breathable pants", "Agility footwear");
    else if (temp >= 30 && temp < 35) items.push("Hyper-light clothing", "Hydration system", "Solar shield");
    else if (temp >= 35) items.push("Solar evasion protocol", "Critical hydration", "UV-deflector gear");
  }

  if (typeof uvIndex === 'number') {
    if (uvIndex > 0) items.push("Sunscreen", "Visual aperture protection");
    if (uvIndex >= 3) items.push("Sunscreen (SPF 30+)", "Tactical sunglasses", "Solar-shield hat");
    if (uvIndex >= 6) items.push("Deploy shade", "Skin-barrier coating");
    if (uvIndex >= 8) items.push("Evasive maneuvers: Direct sun", "Full spectrum coverage");
  }

  if (typeof rainfall === 'number') {
    if (rainfall > 50) items.push("Hydro-locking boots", "Raincoat (Class IV)", "Equipment moisture guard");
    else if (rainfall > 0) items.push("Acoustic umbrella", "Water-repellant shell");
  }

  return Array.from(new Set(items));
}

const fetchOpenMeteo = async (lat, lon) => {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=uv_index,precipitation`;
    const response = await fetch(url);
    if (!response.ok) return { uvIndex: null, rainfall: null };
    const data = await response.json();
    const now = new Date();
    const hourString = now.toISOString().slice(0, 13);
    const hourIndex = data.hourly.time.findIndex(t => t.startsWith(hourString));
    const uvIndex = hourIndex !== -1 ? data.hourly.uv_index[hourIndex] : null;
    const rainfall = hourIndex !== -1 ? data.hourly.precipitation[hourIndex] : null;
    return { uvIndex, rainfall };
  } catch (err) {
    return { uvIndex: null, rainfall: null };
  }
};

const WeatherApp = () => {
  const { t } = useTranslation();
  const apiKey = "d1913710720b5095ce7b6763b3f46e71";
  const [city, setCity] = useState("Kolkata");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkWeather("Kolkata");
  }, []);

  const getCoordinates = async (cityName) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${cityName},India`);
      const data = await response.json();
      return data.length > 0 ? { lat: data[0].lat, lon: data[0].lon } : null;
    } catch (err) {
      return null;
    }
  };

  const checkWeather = async (targetCityName) => {
    const queryCity = targetCityName || city;
    if (!queryCity.trim()) return;

    setLoading(true);
    setError("");
    try {
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?units=metric&q=${queryCity}&appid=${apiKey}`;
      const response = await fetch(weatherUrl);

      let weatherData;
      if (!response.ok) {
        const coords = await getCoordinates(queryCity);
        if (!coords) throw new Error(t("weather.cityNotFound"));
        const coordResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${coords.lat}&lon=${coords.lon}&appid=${apiKey}`);
        if (!coordResponse.ok) throw new Error(t("weather.cityNotFound"));
        weatherData = await coordResponse.json();
        weatherData.name = queryCity;
      } else {
        weatherData = await response.json();
      }

      const meteo = await fetchOpenMeteo(weatherData.coord.lat, weatherData.coord.lon);
      const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?units=metric&lat=${weatherData.coord.lat}&lon=${weatherData.coord.lon}&appid=${apiKey}`);
      const forecastData = await forecastResponse.json();
      const dailyForecast = forecastData.list.filter((_, idx) => idx % 8 === 0).slice(0, 5);

      setWeather({ ...weatherData, uvIndex: meteo.uvIndex, rainfall: meteo.rainfall });
      setForecast(dailyForecast);
    } catch (err) {
      setError(err.message);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-[#0a0a0c]/80 backdrop-blur-2xl overflow-hidden rounded-[3rem] shadow-2xl border border-white/5">
      <div className="p-12 space-y-12">
        {/* Search & Sync Cluster */}
        <div className="flex gap-6">
          <div className="relative flex-1 group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 w-5 h-5 group-focus-within:text-cyan-400 transition-colors" />
            <input
              type="text"
              placeholder="Search destination (e.g. Delhi, Mumbai)..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && checkWeather()}
              className="w-full bg-white/5 border border-white/10 rounded-[2rem] py-6 pl-16 pr-6 text-white placeholder:text-white/30 font-bold focus:bg-white/10 focus:ring-0 outline-none transition-all h-auto"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => checkWeather()}
            disabled={loading}
            className="bg-cyan-600 hover:bg-cyan-500 text-white font-black uppercase tracking-widest text-[10px] px-12 rounded-[2rem] disabled:opacity-50 shadow-xl shadow-cyan-500/20 transition-all flex items-center justify-center gap-3"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : null}
            {loading ? "Establishing Link..." : "Sync coordinates"}
          </motion.button>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-6 rounded-2xl text-[10px] font-black tracking-widest flex items-center gap-4"
            >
              <div className="bg-rose-500 w-2.5 h-2.5 rounded-full animate-ping" />
              SYSTEM OVERRIDE: {error}
            </motion.div>
          )}

          {weather && !loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-12"
            >
              {/* Main Weather Card HUD */}
              <div className="bg-white/5 rounded-[4rem] p-12 border border-white/10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 blur-[130px] rounded-full pointer-events-none" />

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-12 relative z-10">
                  <div className="space-y-6">
                    <div className="flex items-center gap-5">
                      <div className="bg-cyan-500/10 p-4 rounded-3xl border border-cyan-500/20">
                        <MapPin size={32} className="text-cyan-400" />
                      </div>
                      <div>
                        <h3 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-none">{weather.name}</h3>
                        <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.5em] mt-2 ml-1">Atmospheric Uplink Active</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-center md:items-end">
                    <div className="flex items-center gap-6">
                      <div className="bg-white/5 p-4 rounded-[2.5rem] shadow-2xl border border-white/5">
                        <img
                          src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
                          alt="weather-icon"
                          className="w-24 h-24"
                        />
                      </div>
                      <div className="text-right">
                        <p className="text-8xl md:text-9xl font-black text-white tracking-tighter leading-none">{Math.round(weather.main.temp)}°</p>
                        <p className="text-cyan-400 text-[12px] font-black uppercase tracking-[0.4em] mt-3 font-mono">{weather.weather[0].description}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 relative z-10">
                  {[
                    { label: "HUMIDITY", value: `${weather.main.humidity}%`, icon: Droplets, color: "text-blue-400" },
                    { label: "WIND VECTOR", value: `${weather.wind.speed}m/s`, icon: Wind, color: "text-emerald-400" },
                    { label: "SOLAR INDEX", value: weather.uvIndex ?? "1.4", icon: Sun, color: "text-amber-400" },
                    { label: "CORE SENSATION", value: `${Math.round(weather.main.feels_like)}°C`, icon: Thermometer, color: "text-rose-400" },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white/5 rounded-[2.5rem] p-8 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-500 group/stat">
                      <div className="flex items-center gap-4 mb-5">
                        <stat.icon size={20} className={stat.color} />
                        <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">{stat.label}</span>
                      </div>
                      <p className="text-3xl font-black text-white group-hover/stat:text-cyan-400 transition-colors">{stat.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Forecast HUD Row */}
              {forecast && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
                  {forecast.map((day, i) => (
                    <div key={i} className="bg-white/5 rounded-[3rem] p-8 border border-white/5 text-center transition-all duration-700 hover:bg-white/10 group/day">
                      <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-6">
                        {new Date(day.dt * 1000).toLocaleDateString("en-US", { weekday: "short" })}
                      </p>
                      <div className="bg-white/5 p-5 rounded-[2rem] inline-block shadow-inner mb-6 group-hover/day:bg-cyan-500/10 transition-colors">
                        <img
                          src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                          alt="icon"
                          className="w-16 h-16"
                        />
                      </div>
                      <p className="text-4xl font-black text-white tracking-tighter group-hover/day:text-cyan-400 transition-colors">{Math.round(day.main.temp)}°</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Protocol Recommendation Section */}
              <div className="bg-cyan-500/5 rounded-[3.5rem] p-12 border border-cyan-500/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[100px] rounded-full" />
                <div className="flex items-center gap-6 mb-12">
                  <div className="bg-cyan-500 p-4 rounded-3xl shadow-xl shadow-cyan-500/20">
                    <Navigation2 size={24} className="text-white fill-current animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-black text-cyan-400 uppercase tracking-[0.6em]">Integrated Mission Loadout</h4>
                    <p className="text-white/20 text-[9px] font-black uppercase tracking-widest mt-1">Satellite optimized packing list</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4">
                  {getEvidenceBasedPacking({
                    temp: weather.main.temp,
                    uvIndex: weather.uvIndex,
                    rainfall: weather.rainfall
                  }).map((item, i) => (
                    <span key={i} className="bg-white/5 px-8 py-5 rounded-[2rem] text-[10px] font-black text-white/60 border border-white/5 hover:border-cyan-500/50 hover:text-white hover:bg-white/10 transition-all uppercase tracking-widest">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : !loading ? (
            <div className="text-center py-40 bg-white/5 rounded-[4rem] border-2 border-dashed border-white/10 opacity-40 italic font-bold">
              <Cloud className="w-24 h-24 mx-auto mb-8 text-white/10" />
              <p className="text-white/20 text-2xl uppercase tracking-[0.3em]">Sector Synchronization Pending</p>
            </div>
          ) : (
            <div className="text-center py-40">
              <RefreshCw className="w-16 h-16 mx-auto mb-8 text-cyan-500 animate-spin" />
              <p className="text-white/20 text-sm font-black uppercase tracking-[0.5em] animate-pulse">Establishing Satellite Frequency...</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default WeatherApp;
