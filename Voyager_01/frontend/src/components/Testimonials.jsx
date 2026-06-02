import React, { useState, useEffect } from "react";
import { FaStar, FaQuoteLeft, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, Star, ChevronLeft, ChevronRight, UserCheck } from "lucide-react";

const reviews = [
  {
    name: "Rivu Basak",
    review: "Amazing experience! Very easy to book flights. The interface is intuitive and saved me so much time compared to other platforms.",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    date: "2 days ago"
  },
  {
    name: "Talha Khan",
    review: "I love the cab booking feature, saved a lot of time! The drivers were punctual and the pricing was transparent.",
    rating: 4,
    avatar: "https://randomuser.me/api/portraits/men/75.jpg",
    date: "1 week ago"
  },
  {
    name: "Rahul Singh",
    review: "Super fast and smooth train booking system! Got my tickets confirmed instantly and the app notifications kept me updated.",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/men/42.jpg",
    date: "3 days ago"
  },
  {
    name: "Sneha Das",
    review: "Great service, had no issues while booking my bus ticket. The seat selection feature is particularly useful.",
    rating: 4,
    avatar: "https://randomuser.me/api/portraits/women/63.jpg",
    date: "5 days ago"
  },
  {
    name: "Vikram Patel",
    review: "The customer support was really helpful and quick! They resolved my booking issue within minutes.",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/men/22.jpg",
    date: "2 weeks ago"
  },
  {
    name: "Alisha Roy",
    review: "Loved the discount feature, got a great deal on my hotel booking! Will definitely use this service again for my next trip.",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    date: "1 month ago"
  },
  {
    name: "Priya Sharma",
    review: "The package deals are fantastic! Booked my entire vacation through this platform and everything went smoothly.",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/women/33.jpg",
    date: "3 weeks ago"
  }
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    let interval;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % reviews.length);
      }, 6000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
    setIsAutoPlaying(false);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
    setIsAutoPlaying(false);
  };

  const currentReview = reviews[currentIndex];

  return (
    <section className="py-32 bg-white relative overflow-hidden">
      {/* Background Ambiance */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-100/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100/20 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-10 relative z-10">
        <div className="text-center mb-24 space-y-6">
          <div className="flex items-center justify-center gap-4">
            <div className="h-[2px] w-12 bg-cyan-600" />
            <span className="text-cyan-800 font-black uppercase tracking-[0.4em] text-[10px]">Community Echoes</span>
            <div className="h-[2px] w-12 bg-cyan-600" />
          </div>
          <h2 className="text-6xl md:text-8xl font-black text-slate-950 tracking-tighter uppercase leading-none">
            VOYAGER <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-indigo-700 italic">VOICES</span>
          </h2>
          <p className="text-slate-500 font-bold italic text-xl max-w-2xl mx-auto">
            "Direct transmissions from the brave souls navigating the grand frontier."
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -50, scale: 0.95 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="bg-slate-50 border border-slate-100 p-16 md:p-24 rounded-[5rem] shadow-2xl shadow-slate-200/50 flex flex-col md:flex-row items-center gap-16 md:gap-24 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-100/30 blur-[100px] rounded-full pointer-events-none" />

              {/* Left: Avatar Cluster */}
              <div className="shrink-0 relative">
                <div className="w-56 h-56 rounded-[4rem] overflow-hidden border-8 border-white shadow-2xl relative group-hover:rotate-3 transition-transform duration-700">
                  <img
                    src={currentReview.avatar}
                    className="w-full h-full object-cover"
                    alt={currentReview.name}
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-cyan-600 p-6 rounded-3xl shadow-xl shadow-cyan-200">
                  <Quote className="text-white w-8 h-8 fill-current" />
                </div>
              </div>

              {/* Right: Content */}
              <div className="flex-1 space-y-10 text-center md:text-left">
                <div className="space-y-4">
                  <div className="flex justify-center md:justify-start gap-1">
                    {[...Array(currentReview.rating)].map((_, i) => (
                      <Star key={i} size={20} className="text-amber-500 fill-amber-500" />
                    ))}
                  </div>
                  <h4 className="text-4xl font-black text-slate-950 uppercase tracking-tight">{currentReview.name}</h4>
                  <div className="flex items-center justify-center md:justify-start gap-3">
                    <UserCheck size={14} className="text-cyan-600" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verified Mission Profile • {currentReview.date}</span>
                  </div>
                </div>

                <p className="text-slate-600 text-2xl md:text-3xl font-bold italic leading-relaxed border-l-4 border-cyan-500/20 pl-0 md:pl-10">
                  "{currentReview.review}"
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="absolute top-1/2 -left-12 -right-12 -translate-y-1/2 flex justify-between pointer-events-none hidden lg:flex">
            <button
              onClick={prevTestimonial}
              className="pointer-events-auto p-8 bg-white text-slate-950 rounded-full border border-slate-100 shadow-2xl hover:bg-slate-950 hover:text-white transition-all active:scale-95 group"
            >
              <FaChevronLeft className="group-hover:-translate-x-1 transition-transform" />
            </button>
            <button
              onClick={nextTestimonial}
              className="pointer-events-auto p-8 bg-white text-slate-950 rounded-full border border-slate-100 shadow-2xl hover:bg-slate-950 hover:text-white transition-all active:scale-95 group"
            >
              <FaChevronRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center mt-16 gap-4">
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setCurrentIndex(i);
                setIsAutoPlaying(false);
              }}
              className={`h-2 transition-all duration-500 rounded-full ${i === currentIndex ? 'w-12 bg-cyan-600 shadow-lg shadow-cyan-200' : 'w-2 bg-slate-200 hover:bg-slate-400'}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;