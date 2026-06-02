import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Compass, MapPin, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const DestinationSlider = () => {
  const { t } = useTranslation();
  const [hiddenGemsIndex, setHiddenGemsIndex] = useState(0);
  const [trendingIndex, setTrendingIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const navigate = useNavigate();

  const hiddenGems = [
    {
      id: 2,
      name: t('destinationSlider.hiddenGems.bishnupur.name'),
      path: "/bishupur",
      image: "https://assets.zeezest.com/images/PROD_bishnupur_1704899861960_thumb_800.jpeg",
      state: "West Bengal"
    },
    {
      id: 3,
      name: t('destinationSlider.hiddenGems.doars.name'),
      path: "/doars",
      image: "https://assets.zeezest.com/images/PROD_dooars%20%281%29_1704900895264_thumb_800.jpeg",
      state: "West Bengal"
    },
    {
      id: 4,
      name: t('destinationSlider.hiddenGems.jhargram.name'),
      path: "/jhargram",
      image: "https://assets.zeezest.com/images/PROD_jhargram_1704899616152_thumb_800.jpeg",
      state: "West Bengal"
    },
    {
      id: 5,
      name: t('destinationSlider.hiddenGems.kankrajhor.name'),
      path: "/kankrajhor",
      image: "https://lh3.googleusercontent.com/gps-cs-s/AC9h4nrKWqd3Q4j6aZpHc78frzFD6o6KipIArimjgsB4ed_yCW4FNnAoe3a1KP8TETdKEwF1PFvGA8kCKBCa6QcTls66edRML7ohpE7sQEIHDuv5DS0gUPmvH5r98Khf_mEDGEYLuKu2=w675-h390-n-k-no",
      state: "West Bengal"
    },
    {
      id: 6,
      name: t('destinationSlider.hiddenGems.ayodhaPahar.name'),
      path: "/AyodhaPahar",
      image: "https://assets.zeezest.com/images/PROD_ayodhya%20pahar_1704899966106_thumb_800.jpeg",
      state: "West Bengal"
    },
    {
      id: 7,
      name: t('destinationSlider.hiddenGems.jaldapara.name'),
      path: "/jaldapara",
      image: "https://assets.zeezest.com/images/PROD_jaldapara%20national%20park_1704900855695_thumb_800.jpeg",
      state: "West Bengal"
    },
    {
      id: 8,
      name: t('destinationSlider.hiddenGems.sandakhpu.name'),
      path: "/sandakhpu",
      image: "https://assets.zeezest.com/images/PROD_sandakphu_1704901003293_thumb_800.jpeg",
      state: "West Bengal"
    },
    {
      id: 9,
      name: t('destinationSlider.hiddenGems.kalimpong.name'),
      path: "/kalimpong",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdVie8VtqkTsECR-K1zIU6qt5s885qVYAezA&s",
      state: "West Bengal"
    },
  ];

  const trendingDestinations = [
    {
      id: 7,
      name: t('destinationSlider.trending.purulia.name'),
      path: "/purulia",
      image: "https://assets-news.housing.com/news/wp-content/uploads/2022/08/18073726/Purulia5.png",
      state: "West Bengal"
    },
    {
      id: 8,
      name: t('destinationSlider.trending.kashmir.name'),
      path: "/kashmir",
      image: "https://img.veenaworld.com/wp-content/uploads/2023/01/shutterstock_2044050407-scaled.jpg",
      state: "India"
    },
    {
      id: 9,
      name: t('destinationSlider.trending.delhi.name'),
      path: "/delhi",
      image: "https://cdn.britannica.com/37/189837-050-F0AF383E/New-Delhi-India-War-Memorial-arch-Sir.jpg",
      state: "India"
    },
    {
      id: 10,
      name: t('destinationSlider.trending.paris.name'),
      path: "/paris",
      image: "https://plus.unsplash.com/premium_photo-1661919210043-fd847a58522d?w=600&auto=format&fit=crop&q=60",
      state: "France"
    },
    {
      id: 11,
      name: t('destinationSlider.trending.kerala.name'),
      path: "/kerala",
      image: "https://tse4.mm.bing.net/th?id=OIP.1LmC3AubOyv1mN-FzKU7BAHaE8&pid=Api&P=0&h=180",
      state: "India"
    },
    {
      id: 12,
      name: t('destinationSlider.trending.andaman.name'),
      path: "/andaman",
      image: "https://tse4.mm.bing.net/th?id=OIP.Vo6dXy0kKreXtnbsnzNeagHaEL&pid=Api&P=0&h=180",
      state: "India"
    }
  ];

  const createInfiniteArray = (arr) => [...arr, ...arr, ...arr];
  const infiniteHiddenGems = createInfiniteArray(hiddenGems);
  const infiniteTrendingDestinations = createInfiniteArray(trendingDestinations);

  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => setHiddenGemsIndex(prev => prev + 1), 5000);
      return () => clearInterval(interval);
    }
  }, [isPaused]);

  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => setTrendingIndex(prev => prev + 1), 5000);
      return () => clearInterval(interval);
    }
  }, [isPaused]);

  useEffect(() => {
    if (hiddenGemsIndex >= hiddenGems.length) {
      setIsTransitioning(false);
      setHiddenGemsIndex(0);
      setTimeout(() => setIsTransitioning(true), 50);
    }
  }, [hiddenGemsIndex, hiddenGems.length]);

  useEffect(() => {
    if (trendingIndex >= trendingDestinations.length) {
      setIsTransitioning(false);
      setTrendingIndex(0);
      setTimeout(() => setIsTransitioning(true), 50);
    }
  }, [trendingIndex, trendingDestinations.length]);

  const nextHiddenGemsSlide = () => setHiddenGemsIndex(prev => prev + 1);
  const prevHiddenGemsSlide = () => {
    if (hiddenGemsIndex === 0) {
      setIsTransitioning(false);
      setHiddenGemsIndex(hiddenGems.length);
      setTimeout(() => {
        setIsTransitioning(true);
        setHiddenGemsIndex(hiddenGems.length - 1);
      }, 50);
    } else {
      setHiddenGemsIndex(prev => prev - 1);
    }
  };

  const nextTrendingSlide = () => setTrendingIndex(prev => prev + 1);
  const prevTrendingSlide = () => {
    if (trendingIndex === 0) {
      setIsTransitioning(false);
      setTrendingIndex(trendingDestinations.length);
      setTimeout(() => {
        setIsTransitioning(true);
        setTrendingIndex(trendingDestinations.length - 1);
      }, 50);
    } else {
      setTrendingIndex(prev => prev - 1);
    }
  };

  const handleCardClick = (path) => {
    if (path) {
      navigate(path);
      window.scrollTo(0, 0);
    }
  };

  const renderSlider = (items, index, next, prev, titleKey) => (
    <div className="mb-24 relative">
      <div className="flex items-center gap-6 mb-12 px-2">
        <div className="bg-cyan-100 p-3 rounded-2xl border border-cyan-200 shadow-sm">
          <Compass className="text-cyan-600 w-6 h-6 animate-pulse" />
        </div>
        <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase">{t(titleKey)}</h2>
      </div>

      <div className="relative group/slider px-2">
        <div className="overflow-visible">
          <motion.div
            className={`flex gap-8 ${isTransitioning ? 'transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]' : ''}`}
            style={{ transform: `translateX(-${index * (340 + 32)}px)` }}
          >
            {items.map((destination, i) => (
              <motion.div
                key={`${destination.id}-${i}`}
                className="flex-shrink-0 w-[340px] h-[480px] group cursor-pointer"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                onClick={() => handleCardClick(destination.path)}
                whileHover={{ y: -15 }}
              >
                <div className="relative h-full rounded-[3.5rem] overflow-hidden bg-white border border-slate-100 group-hover:border-cyan-500/30 transition-all duration-700 shadow-xl shadow-slate-200/40">
                  <div className="h-2/3 overflow-hidden relative">
                    <img
                      src={destination.image}
                      alt={destination.name}
                      className="w-full h-full object-cover transition-transform duration-[1500ms] group-hover:scale-110"
                      loading="lazy"
                    />
                    {/* Immersive Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-transparent opacity-60" />

                    <div className="absolute top-8 left-8">
                      <div className="bg-white/90 backdrop-blur-xl border border-slate-100 px-4 py-2 rounded-2xl shadow-lg">
                        <span className="text-[10px] font-black uppercase tracking-widest text-cyan-700">Exploration Target</span>
                      </div>
                    </div>
                  </div>

                  <div className="h-1/3 p-10 bg-white relative flex flex-col justify-center">
                    <h3 className="text-3xl font-black text-slate-950 leading-tight mb-4 tracking-tighter group-hover:text-cyan-600 transition-colors uppercase">{destination.name}</h3>
                    <div className="flex items-center justify-between">
                      <p className="flex items-center gap-2.5 text-[11px] text-slate-400 font-black uppercase tracking-[0.2em] font-mono">
                        <MapPin size={16} className="text-cyan-600" /> {destination.state || "Sector Alpha"}
                      </p>
                      <div className="bg-slate-50 p-3 rounded-2xl group-hover:bg-slate-900 group-hover:text-white transition-all shadow-inner border border-slate-100">
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Custom Navigation - Light HUD */}
        <div className="absolute top-1/2 -left-10 -right-10 -translate-y-1/2 flex justify-between pointer-events-none opacity-0 group-hover/slider:opacity-100 transition-all duration-700">
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="pointer-events-auto w-20 h-20 bg-white/90 backdrop-blur-3xl border border-slate-100 rounded-full flex items-center justify-center text-slate-950 hover:bg-slate-950 hover:text-white transition-all shadow-2xl active:scale-90"
          >
            <ChevronLeft size={40} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="pointer-events-auto w-20 h-20 bg-white/90 backdrop-blur-3xl border border-slate-100 rounded-full flex items-center justify-center text-slate-950 hover:bg-slate-950 hover:text-white transition-all shadow-2xl active:scale-90"
          >
            <ChevronRight size={40} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="py-20">
      {renderSlider(infiniteHiddenGems, hiddenGemsIndex, nextHiddenGemsSlide, prevHiddenGemsSlide, "destinationSlider.hiddenGemsTitle")}
      {renderSlider(infiniteTrendingDestinations, trendingIndex, nextTrendingSlide, prevTrendingSlide, "destinationSlider.trendingTitle")}
    </div>
  );
};

export default DestinationSlider;