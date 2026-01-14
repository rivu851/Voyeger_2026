"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronLeft, Headphones, MapPin, ArrowRight } from "lucide-react"

const API_BASE = "https://voyeger2026-backend.onrender.com/api"

export default function Monuments() {
  // Views: 'gallery', 'overview', 'tour'
  const [view, setView] = useState("gallery")
  const [monuments, setMonuments] = useState([])
  const [currentMonument, setCurrentMonument] = useState(null)
  const [currentFrame, setCurrentFrame] = useState(null)
  const [currentVibe, setCurrentVibe] = useState("professor")
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  
  const audioRef = useRef(null)

  useEffect(() => {
    fetchMonuments()
  }, [])

  const fetchMonuments = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${API_BASE}/monuments/getAll`)
      const data = await res.json()
      setMonuments(data)
    } catch (error) {
      console.error("Error fetching monuments:", error)
    } finally {
      setLoading(false)
    }
  }

  // --- Navigation Logic ---

  const startTour = async (monumentId) => {
    try {
      const res = await fetch(`${API_BASE}/monuments/getById/${monumentId}`)
      const data = await res.json()
      setCurrentMonument(data)
      setCurrentFrame(null) // Reset frame to show Overview first
      setView("overview")
      window.scrollTo(0, 0)
    } catch (error) {
      console.error("Error starting tour:", error)
    }
  }

  const loadEntryFrame = async () => {
    try {
      const res = await fetch(`${API_BASE}/frames/getEntryFrameByMonumentId/${currentMonument._id}`)
      const entryFrame = await res.json()
      setCurrentFrame(entryFrame)
      setView("tour")
      window.scrollTo(0, 0)
    } catch (error) {
      console.error("Error loading entry frame:", error)
    }
  }

  const navigateToFrame = async (frameId) => {
    try {
      const res = await fetch(`${API_BASE}/frames/getById/${frameId}`)
      const nextFrame = await res.json()
      setCurrentFrame(nextFrame)
      window.scrollTo(0, 0)
    } catch (error) {
      console.error("Error navigating:", error)
    }
  }

  const showGallery = () => {
    setView("gallery")
    setCurrentMonument(null)
    setCurrentFrame(null)
  }

  // --- Helpers ---

  const filteredMonuments = monuments.filter(m =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Get content based on current state (Overview vs Frame)
  const getDisplayContent = () => {
    if (view === "tour" && currentFrame) {
      return {
        title: currentFrame.title,
        image: currentFrame.imageUrl,
        text: currentFrame.narration[currentVibe] || "...",
        audio: currentFrame.narrationAudioUrl[currentVibe]
      }
    }
    return {
      title: currentMonument?.name,
      image: currentMonument?.imgUrl,
      text: currentMonument?.overview?.[currentVibe] || "Welcome to this historic site.",
      audio: currentMonument?.overviewAudioUrl?.[currentVibe]
    }
  }

  const content = getDisplayContent()

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 
            onClick={showGallery}
            className="text-2xl font-black tracking-tighter text-cyan-500 cursor-pointer hover:text-cyan-400 transition-colors"
          >
            VOYAGER.
          </h1>

          {view === "gallery" && (
            <input
              type="text"
              placeholder="Search destinations..."
              className="bg-slate-800 border-slate-700 rounded-full px-6 py-2 w-64 focus:ring-2 focus:ring-cyan-500 outline-none text-sm transition-all"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {view === "gallery" ? (
          /* GALLERY VIEW */
          <section>
            <h2 className="text-3xl font-bold mb-10 text-white">Explore the World</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredMonuments.map(m => (
                <div 
                  key={m._id} 
                  onClick={() => startTour(m._id)}
                  className="group cursor-pointer bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 hover:border-cyan-500/50 transition-all"
                >
                  <div className="aspect-video overflow-hidden">
                    <img src={m.imgUrl} alt={m.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">{m.name}</h3>
                    <p className="flex items-center gap-1 text-slate-400 text-sm mt-2">
                      <MapPin size={14} /> {m.location?.address || 'Ancient Site'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : (
          /* TOUR / OVERVIEW VIEW */
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <button 
              onClick={showGallery}
              className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 mb-8 transition-colors"
            >
              <ChevronLeft size={20} /> Back to Gallery
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
              {/* Media Column */}
              <div className="lg:col-span-3 space-y-6">
                <div className="rounded-3xl overflow-hidden shadow-2xl shadow-black/50 border border-slate-800">
                  <img src={content.image} alt={content.title} className="w-full aspect-video object-cover" />
                </div>
                
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center gap-4">
                  <div className="bg-cyan-500/10 p-3 rounded-xl text-cyan-500">
                    <Headphones size={24} />
                  </div>
                  <audio 
                    ref={audioRef}
                    key={content.audio} // Forces re-render when vibe changes
                    src={content.audio} 
                    controls 
                    autoPlay
                    className="flex-1 h-10 accent-cyan-500" 
                  />
                </div>
              </div>

              {/* Content Column */}
              <div className="lg:col-span-2 space-y-8">
                <div className="flex items-center justify-between items-start">
                  <h2 className="text-4xl font-black text-white leading-tight">{content.title}</h2>
                  <select 
                    value={currentVibe}
                    onChange={(e) => setCurrentVibe(e.target.value)}
                    className="bg-slate-800 border-none rounded-lg py-2 px-3 text-sm font-bold text-cyan-400 focus:ring-2 focus:ring-cyan-500 cursor-pointer"
                  >
                    <option value="professor">🎓 Professor</option>
                    <option value="local">🏠 Local</option>
                    <option value="fun">🎉 Fun</option>
                    <option value="cynical">💀 Cynical</option>
                  </select>
                </div>

                <p className="text-lg text-slate-300 leading-relaxed italic border-l-4 border-cyan-500/30 pl-6">
                  {content.text}
                </p>

                <div className="pt-8 border-t border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Continue Journey</h4>
                  
                  <div className="space-y-3">
                    {view === "overview" ? (
                      <button 
                        onClick={loadEntryFrame}
                        className="w-full flex items-center justify-between group p-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold transition-all transform hover:translate-x-2"
                      >
                        Begin Visual Tour <ArrowRight size={20} />
                      </button>
                    ) : (
                      <>
                        {currentFrame?.pathsForward?.length > 0 ? (
                          currentFrame.pathsForward.map(path => (
                            <button 
                              key={path.nextFrameId}
                              onClick={() => navigateToFrame(path.nextFrameId)}
                              className="w-full flex items-center justify-between group p-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold border border-slate-700 transition-all transform hover:translate-x-2"
                            >
                              {path.nextFrameLabel || "Move Forward"} <ArrowRight size={20} className="text-cyan-500" />
                            </button>
                          ))
                        ) : (
                          <div className="text-center p-8 bg-slate-900/50 rounded-2xl border border-dashed border-slate-700">
                            <p className="text-cyan-500 font-bold mb-4">Tour Complete</p>
                            <button 
                              onClick={showGallery}
                              className="px-6 py-2 bg-slate-800 rounded-lg text-sm hover:bg-slate-700"
                            >
                              Return Home
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}