"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronLeft, Headphones, MapPin, ArrowRight, Compass, LayoutGrid, Search, Play, Volume2 } from "lucide-react"
import { Viewer } from "@photo-sphere-viewer/core"
import "@photo-sphere-viewer/core/index.css"
import { motion, AnimatePresence } from "framer-motion"

const API_BASE = "https://voyeger2026-backend.onrender.com/api"

export default function Monuments() {
  const [view, setView] = useState("gallery")
  const [monuments, setMonuments] = useState([])
  const [currentMonument, setCurrentMonument] = useState(null)
  const [currentFrame, setCurrentFrame] = useState(null)
  const [currentVibe, setCurrentVibe] = useState("professor")
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  const audioRef = useRef(null)
  const viewerContainerRef = useRef(null)
  const viewerRef = useRef(null)

  /* ---------------- FETCH ---------------- */

  useEffect(() => {
    fetch(`${API_BASE}/monuments/getAll`)
      .then(res => res.json())
      .then(setMonuments)
      .finally(() => setLoading(false))
  }, [])

  /* ---------------- NAVIGATION ---------------- */

  const startTour = async (id) => {
    const res = await fetch(`${API_BASE}/monuments/getById/${id}`)
    const data = await res.json()
    setCurrentMonument(data)
    setCurrentFrame(null)
    setView("overview")
    window.scrollTo(0, 0)
  }

  const loadEntryFrame = async () => {
    const res = await fetch(
      `${API_BASE}/frames/getEntryFrameByMonumentId/${currentMonument._id}`
    )
    const frame = await res.json()
    setCurrentFrame(frame)
    setView("tour")
    window.scrollTo(0, 0)
  }

  const navigateToFrame = async (frameId) => {
    const res = await fetch(`${API_BASE}/frames/getById/${frameId}`)
    const frame = await res.json()
    setCurrentFrame(frame)
    window.scrollTo(0, 0)
  }

  const showGallery = () => {
    setView("gallery")
    setCurrentMonument(null)
    setCurrentFrame(null)
  }

  /* ---------------- CONTENT ---------------- */

  const content = (() => {
    if (view === "tour" && currentFrame) {
      return {
        title: currentFrame.title,
        image: currentFrame.imageUrl,
        text: currentFrame.narration[currentVibe],
        audio: currentFrame.narrationAudioUrl[currentVibe]
      }
    }
    return {
      title: currentMonument?.name,
      image: currentMonument?.imgUrl,
      text: currentMonument?.overview?.[currentVibe],
      audio: currentMonument?.overviewAudioUrl?.[currentVibe]
    }
  })()

  /* ---------------- 360 VIEW ---------------- */

  useEffect(() => {
    if (!viewerContainerRef.current || !content?.image) return

    if (viewerRef.current) {
      viewerRef.current.destroy()
      viewerRef.current = null
    }

    viewerRef.current = new Viewer({
      container: viewerContainerRef.current,
      panorama: content.image,
      defaultZoomLvl: 40,
      mousewheelCtrlKey: false,
      touchmoveTwoFingers: true,
      navbar: ["zoom", "fullscreen"],
      loadingTxt: "Establishing Visual Link...",
      panoData: {
        fullWidth: 4000,
        fullHeight: 2000,
        croppedWidth: 4000,
        croppedHeight: 2000,
        croppedX: 0,
        croppedY: 0
      }
    })

    return () => {
      viewerRef.current?.destroy()
      viewerRef.current = null
    }
  }, [content?.image])

  return (
    <div className="min-h-screen bg-[#020617] text-white pb-32 selection:bg-cyan-500/30">
      {/* Background Ambiance */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-[-10%] w-[50%] h-[50%] bg-blue-600/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-[-10%] w-[50%] h-[50%] bg-indigo-600/5 blur-[120px] rounded-full" />
      </div>

      <header className="sticky top-0 z-[50] bg-[#0a0a0c]/80 backdrop-blur-2xl border-b border-white/5 shadow-2xl">
        <div className="max-w-7xl mx-auto px-10 py-6 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <h1
              onClick={showGallery}
              className="text-3xl font-black text-white tracking-tighter cursor-pointer hover:scale-105 transition group"
            >
              VOYAGER<span className="text-cyan-500 group-hover:animate-pulse">.</span>
            </h1>
          </div>

          {view === "gallery" && (
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 w-4 h-4" />
              <input
                placeholder="Search monuments..."
                className="w-full bg-white/5 px-14 py-4 rounded-2xl border border-white/10 focus:outline-none focus:border-cyan-500/30 transition-all font-bold text-sm"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          )}
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-10 py-20">
        <AnimatePresence mode="wait">
          {view === "gallery" ? (
            <motion.section
              key="gallery"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-16"
            >
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="h-[2px] w-12 bg-cyan-500" />
                  <span className="text-cyan-400 font-black uppercase tracking-[0.4em] text-[10px]">World Heritage Sites</span>
                </div>
                <h2 className="text-7xl md:text-9xl font-black text-white tracking-tighter leading-[0.85]">
                  MAGNIFICENT <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500 italic">TREASURES</span>
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {monuments
                  .filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((m, idx) => (
                    <motion.div
                      key={m._id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => startTour(m._id)}
                      className="group cursor-pointer bg-[#0a0a0c] rounded-[3rem] overflow-hidden border border-white/5 hover:border-cyan-500/30 transition-all duration-700 hover:-translate-y-4 shadow-2xl"
                    >
                      <div className="aspect-[4/3] overflow-hidden relative">
                        <img
                          src={m.imgUrl}
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-60 group-hover:opacity-100"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-transparent" />
                      </div>
                      <div className="p-10 space-y-4">
                        <h3 className="text-3xl font-black text-white group-hover:text-cyan-400 transition-colors uppercase tracking-tight">{m.name}</h3>
                        <div className="flex items-center gap-2 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
                          <MapPin size={14} className="text-cyan-500" /> {m.location?.address || "Explore Location"}
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </motion.section>
          ) : (
            <motion.section
              key="tour"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-16"
            >
              <div className="flex items-center justify-between">
                <button
                  onClick={showGallery}
                  className="flex items-center gap-5 bg-white/5 border border-white/10 px-10 py-5 rounded-[2rem] text-white/40 hover:text-white hover:bg-white/10 transition-all group font-black uppercase tracking-widest text-xs"
                >
                  <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  Return to gallery
                </button>

                <div className="flex items-center gap-6 bg-[#0a0a0c] p-3 rounded-[2rem] border border-white/5">
                  <div className="bg-white/5 p-3 rounded-2xl">
                    <LayoutGrid className="text-cyan-500 w-5 h-5" />
                  </div>
                  <select
                    value={currentVibe}
                    onChange={(e) => setCurrentVibe(e.target.value)}
                    className="bg-transparent px-4 py-2 rounded-xl text-white font-black text-xs uppercase tracking-widest focus:outline-none appearance-none cursor-pointer outline-none"
                  >
                    <option value="professor">🎓 Professor</option>
                    <option value="local">🏠 Local Voice</option>
                    <option value="fun">🎉 Dynamic</option>
                    <option value="cynical">💀 Analytical</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                <div className="lg:col-span-8 space-y-10">
                  <div className="relative">
                    <div
                      ref={viewerContainerRef}
                      className="w-full aspect-[16/10] rounded-[4rem] overflow-hidden border border-white/5 bg-black shadow-2xl transition-all duration-700 relative"
                    />
                    {/* Audio Player HUD Overlay */}
                    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full max-w-md px-10">
                      <div className="bg-[#0a0a0c]/80 backdrop-blur-2xl p-6 rounded-[2.5rem] shadow-2xl border border-white/5 flex items-center gap-6">
                        <div className="bg-cyan-500 p-4 rounded-2xl shadow-lg shadow-cyan-500/20">
                          <Volume2 className="text-white w-5 h-5" />
                        </div>
                        <audio
                          ref={audioRef}
                          key={content.audio}
                          src={content.audio}
                          controls
                          autoPlay
                          className="flex-1 custom-audio-player h-10"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-4 flex flex-col justify-center space-y-10">
                  {/* Info Panel HUD */}
                  <div className="bg-[#0a0a0c] p-16 rounded-[4.5rem] border border-white/5 shadow-2xl relative overflow-hidden flex flex-col h-full lg:max-h-[80vh]">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/5 blur-[80px] rounded-full pointer-events-none" />

                    <div className="space-y-8 flex-1 flex flex-col overflow-hidden">
                      <h2 className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-tight uppercase shrink-0">
                        {content.title}
                      </h2>

                      <div className="flex-1 overflow-y-auto pr-6 custom-scrollbar scroll-smooth">
                        <p className="text-white/60 text-xl leading-relaxed font-bold italic border-l-4 border-cyan-500/20 pl-10">
                          "{content.text}"
                        </p>
                      </div>
                    </div>

                    <div className="pt-12 border-t border-white/5 mt-10 shrink-0">
                      {view === "overview" ? (
                        <button
                          onClick={loadEntryFrame}
                          className="group w-full bg-cyan-600 text-white py-8 rounded-[2.5rem] font-black uppercase tracking-[0.3em] text-[10px] flex items-center justify-center gap-6 hover:bg-cyan-500 shadow-xl shadow-cyan-500/20 transition-all active:scale-95"
                        >
                          Unlock Experience <Play size={18} className="fill-current" />
                        </button>
                      ) : currentFrame?.pathsForward?.length > 0 ? (
                        <div className="space-y-4">
                          {currentFrame.pathsForward.map(p => (
                            <button
                              key={p.nextFrameId}
                              onClick={() => navigateToFrame(p.nextFrameId)}
                              className="w-full flex items-center justify-between bg-white/5 hover:bg-white/10 border border-white/5 p-8 rounded-[2.5rem] group transition-all duration-500 shadow-xl active:scale-95"
                            >
                              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 group-hover:text-white">
                                {p.nextFrameLabel || "Advance Position"}
                              </span>
                              <div className="bg-cyan-500/20 p-3 rounded-2xl group-hover:bg-cyan-500 transition-all">
                                <ArrowRight size={20} className="text-cyan-400 group-hover:text-white group-hover:translate-x-1" />
                              </div>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center p-12 bg-white/5 rounded-[3rem] border border-white/10">
                          <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] mb-8">
                            Journey Conclusion Reached
                          </p>
                          <button
                            onClick={showGallery}
                            className="w-full bg-white text-black py-6 rounded-[2.5rem] font-black uppercase tracking-[0.2em] text-[10px] hover:bg-cyan-400 transition-all"
                          >
                            Return to hub
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
