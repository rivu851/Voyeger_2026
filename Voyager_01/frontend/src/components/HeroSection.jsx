import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Play, Globe, Radar, Target } from "lucide-react";

const images = [
  "https://cultureandheritage.org/wp-content/uploads/2023/06/xyz-53-1200x613.jpg",
  "https://www.oyorooms.com/travel-guide/wp-content/uploads/2019/12/Generic-6-5.jpg",
  "https://assets.traveltriangle.com/blog/wp-content/uploads/2020/01/Kolkata_13th-jan.jpg",
  "https://www.trawell.in/blog/wp-content/uploads/2022/08/west_bengal-1-730x410.jpg",
  "https://cdn.britannica.com/68/178168-050-EED35840/Somapura-Mahavira-Paharpur-Bangladesh.jpg",
  "https://im.whatshot.in/content/2017/Sep/1504796610-body-3-cropped.jpg",
  "https://www.godigit.com/content/dam/godigit/directportal/en/contenthm/heritage-sites-in-west-bengal.jpg"
];

const HeroSection = () => {
  const { t } = useTranslation();
  const { user } = useAppContext();
  const [index, setIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const preloadImages = async () => {
      const promises = images.map((src) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = src;
          img.onload = resolve;
          img.onerror = resolve;
        });
      });
      await Promise.all(promises);
      setLoaded(true);
    };

    preloadImages();
  }, []);

  useEffect(() => {
    if (loaded) {
      const interval = setInterval(() => {
        setIndex((prev) => (prev + 1) % images.length);
      }, 7000);
      return () => clearInterval(interval);
    }
  }, [loaded]);

  return (
    <section className="relative w-full h-[100vh] overflow-hidden bg-[#030305] flex items-center justify-center">
      {/* Dynamic Background Slider */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          {loaded && (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 1.25, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
              transition={{ duration: 3, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <img
                src={images[index]}
                alt="Travel Destination"
                className="w-full h-full object-cover select-none"
              />
              {/* Multi-layered HUD Overlays */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#030305] via-transparent to-[#030305]/40" />
              <div className="absolute inset-0 bg-gradient-to-b from-[#030305]/80 via-transparent to-[#030305]/90" />

              {/* Scanline Grid Effect */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: `linear-gradient(rgba(18, 150, 243, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(18, 150, 243, 0.1) 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Decorative HUD Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-1/4 left-10 w-[1px] h-32 bg-gradient-to-b from-transparent via-cyan-500 to-transparent" />
        <div className="absolute bottom-1/4 right-10 w-[1px] h-32 bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
        <div className="absolute top-10 left-1/4 w-32 h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
        <div className="absolute bottom-10 right-1/4 w-32 h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
      </div>

      {/* Hero Content Panel */}
      <div className="relative z-10 w-full max-w-[1600px] px-6 md:px-16 mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Status Indicator */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-3 mb-8"
            >
              <div className="relative">
                <div className="w-2 h-2 bg-cyan-500 rounded-full animate-ping absolute inset-0" />
                <div className="w-2 h-2 bg-cyan-400 rounded-full relative" />
              </div>
              <span className="text-cyan-400 font-mono text-[10px] uppercase tracking-[0.4em] drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
                Network Online // Active Reconnaissance
              </span>
            </motion.div>

            {/* Title Area */}
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white leading-[0.9] tracking-[ -0.05em] mb-10">
              <span className="block opacity-90">UNFOLD THE</span>
              <span className="relative inline-block">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 drop-shadow-[0_0_25px_rgba(59,130,246,0.3)]">
                  ODYSSEY
                </span>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 1, duration: 1 }}
                  className="absolute -bottom-2 left-0 h-1.5 bg-cyan-500/30 blur-sm"
                />
              </span>
            </h1>

            {/* HUD Intelligence Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
              className="backdrop-blur-2xl bg-white/[0.03] border border-white/[0.08] p-8 rounded-[2rem] mb-12 relative overflow-hidden group hover:border-cyan-500/20 transition-colors"
            >
              <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
                <Radar className="w-8 h-8 text-cyan-400 animate-spin-slow" />
              </div>
              <div className="flex gap-6">
                <div className="flex flex-col gap-2">
                  <div className="w-1 h-8 bg-cyan-500/40 rounded-full" />
                  <div className="w-1 h-4 bg-white/10 rounded-full" />
                </div>
                <div>
                  <p className="text-lg md:text-xl text-slate-300 font-medium leading-relaxed font-mono">
                    "Analyzing coordinates... Destinations detected. The world is a canvas of unexplored wonders waiting for your unique perception."
                  </p>
                  <div className="mt-4 flex gap-4 text-[10px] font-mono text-cyan-400/60 uppercase">
                    <span>Lat: 22.5726° N</span>
                    <span>Long: 88.3639° E</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Action Matrix */}
            <div className="flex flex-wrap items-center gap-8">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to={user == null ? "/login" : "/explore"}
                  className="group relative flex items-center gap-6 bg-white text-black px-10 py-5 rounded-2xl font-black text-lg transition-all overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <span className="relative z-10 group-hover:text-white transition-colors uppercase tracking-widest">{t("herosec.explore")}</span>
                  <div className="relative z-10 bg-black/5 p-2 rounded-xl group-hover:bg-white/10 group-hover:rotate-90 transition-all duration-500 group-hover:text-white">
                    <Target className="w-5 h-5" />
                  </div>
                </Link>
              </motion.div>

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="flex items-center gap-4 text-white/40 hover:text-cyan-400 transition-all group"
              >
                <div className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center group-hover:border-cyan-400/50 group-hover:bg-cyan-400/5 transition-all shadow-glow">
                  <Play className="w-5 h-5 fill-current" />
                </div>
                <div className="flex flex-col items-start leading-none">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] mb-1">Visual Log</span>
                  <span className="text-xs font-mono opacity-60">Play Transmission</span>
                </div>
              </motion.button>
            </div>
          </motion.div>

          {/* HUD Right Panel (Hidden on Mobile) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="hidden lg:flex flex-col items-end gap-6"
          >
            <div className="w-72 aspect-square rounded-full border border-white/5 relative flex items-center justify-center">
              <div className="absolute inset-0 animate-spin-slow border-t-2 border-cyan-500/20 rounded-full" />
              <div className="absolute inset-4 animate-reverse-spin border-b-2 border-blue-500/20 rounded-full" />
              <Globe className="w-32 h-32 text-cyan-400/10" />

              {/* Floating Data Nodes */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    y: [0, -10, 0],
                    opacity: [0.2, 0.5, 0.2]
                  }}
                  transition={{
                    duration: 3 + i,
                    repeat: Infinity,
                    delay: i
                  }}
                  className={`absolute w-12 h-12 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-center`}
                  style={{
                    top: `${20 + i * 30}%`,
                    right: `${-20 + i * 10}%`
                  }}
                >
                  <div className="w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_10px_cyan]" />
                </motion.div>
              ))}
            </div>

            <div className="text-right font-mono">
              <p className="text-xs text-white/20 uppercase tracking-widest mb-1">Global Traffic Index</p>
              <p className="text-3xl font-black text-white tracking-tighter">74.2K <span className="text-cyan-500 text-sm">UP</span></p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Navigation Footer Indicator */}
      <div className="absolute bottom-10 left-10 right-10 z-20 flex justify-between items-end">
        <div className="flex flex-col gap-4">
          <div className="w-48 h-[1px] bg-gradient-to-r from-cyan-500 to-transparent" />
          <span className="text-[10px] font-mono text-cyan-400 opacity-40 uppercase tracking-[0.5em]">Sector: Travel Intelligence</span>
        </div>

        <div className="flex flex-col items-center gap-4">
          <motion.div
            animate={{ y: [0, 8, 0], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-[1px] h-12 bg-white"
          />
          <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.5em] rotate-180 [writing-mode:vertical-lr]">Scroll</span>
        </div>

        <div className="flex gap-4">
          {images.map((_, i) => (
            <div
              key={i}
              className={`w-6 h-1 transition-all duration-500 ${index === i ? 'bg-cyan-500 w-12' : 'bg-white/10'}`}
            />
          ))}
        </div>
      </div>

      {/* Ambient Visualizer Elements */}
      <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-blue-500/10 blur-[150px] rounded-full mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-indigo-500/10 blur-[150px] rounded-full mix-blend-screen pointer-events-none" />
    </section>
  );
};

export default HeroSection;

