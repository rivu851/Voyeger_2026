"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, Headphones } from "lucide-react"

const API_BASE = "http://localhost:5000/api"

export default function Monuments() {
  const [view, setView] = useState("gallery") // 'gallery' or 'tour'
  const [monuments, setMonuments] = useState([])
  const [currentMonument, setCurrentMonument] = useState(null)
  const [currentFrame, setCurrentFrame] = useState(null)
  const [currentVibe, setCurrentVibe] = useState("professor")
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

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

  // Filter monuments based on search
  const filteredMonuments = monuments.filter(
    (m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const startTour = async (monumentId) => {
    try {
      const monumentRes = await fetch(`${API_BASE}/monuments/getById/${monumentId}`)
      const monument = await monumentRes.json()
      setCurrentMonument(monument)

      const frameRes = await fetch(`${API_BASE}/frames/getEntryFrameByMonumentId/${monumentId}`)
      const entryFrame = await frameRes.json()
      setCurrentFrame(entryFrame)
      setCurrentVibe("professor")
      setView("tour")
      window.scrollTo(0, 0)
    } catch (error) {
      console.error("Error starting tour:", error)
    }
  }

  const navigateToFrame = async (frameId) => {
    try {
      const res = await fetch(`${API_BASE}/frames/getById/${frameId}`)
      const nextFrame = await res.json()
      setCurrentFrame(nextFrame)
      window.scrollTo(0, 0)
    } catch (error) {
      console.error("Error navigating to frame:", error)
    }
  }

  const showGallery = () => {
    setView("gallery")
    setCurrentFrame(null)
    setSearchTerm("")
  }

  const isEndOfTour = !currentFrame || currentFrame.type === "EXIT" || currentFrame.pathsForward.length === 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => showGallery()}
            className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 transition-all cursor-pointer"
          >
            VOYAGER
          </button>

          {view === "gallery" && (
            <div className="flex-1 mx-8">
              <input
                type="text"
                placeholder="Search monuments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all"
              />
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {view === "gallery" ? (
          // Gallery View
          <section>
            <h2 className="text-4xl font-bold text-white mb-12 text-center">Select a Destination</h2>
            {loading ? (
              <div className="text-center py-12">
                <p className="text-slate-400 text-lg">Loading monuments...</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredMonuments.map((monument) => (
                    <div
                      key={monument._id}
                      onClick={() => startTour(monument._id)}
                      className="group cursor-pointer bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl overflow-hidden border border-slate-600 hover:border-cyan-400 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-400/20 transform hover:scale-105"
                    >
                      <div className="relative overflow-hidden h-48 bg-slate-700">
                        <img
                          src={monument.imgUrl || "/placeholder.svg"}
                          alt={monument.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                          {monument.name}
                        </h3>
                        <p className="text-sm text-slate-400 line-clamp-2">
                          {monument.description?.substring(0, 80)}...
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                {filteredMonuments.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-slate-400 text-lg">No monuments found matching your search.</p>
                  </div>
                )}
              </>
            )}
          </section>
        ) : (
          // Tour View
          <section>
            <button
              onClick={() => showGallery()}
              className="flex items-center gap-2 mb-6 px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-300 hover:text-white hover:border-cyan-400 transition-all"
            >
              <ChevronLeft size={20} />
              Back to Gallery
            </button>

            {currentMonument && currentFrame && (
              <>
                {/* Tour Header */}
                <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6 bg-gradient-to-r from-slate-800 to-slate-700 border border-slate-600 rounded-xl p-6">
                  <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                    {currentMonument.name}
                  </h2>

                  {/* Vibe Selector */}
                  <div className="flex items-center gap-3 bg-slate-700/50 px-4 py-3 rounded-lg border border-slate-600">
                    <label className="text-slate-300 font-medium whitespace-nowrap">Choose Vibe:</label>
                    <select
                      value={currentVibe}
                      onChange={(e) => setCurrentVibe(e.target.value)}
                      className="px-3 py-2 bg-slate-800 border border-slate-600 rounded text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
                    >
                      <option value="professor">🎓 Professor</option>
                      <option value="local">🏠 Local</option>
                      <option value="fun">🎉 Fun</option>
                      <option value="cynical">💀 Cynical</option>
                    </select>
                  </div>
                </div>

                {/* Frame Display */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-700 border border-slate-600 rounded-xl overflow-hidden shadow-2xl mb-8">
                  <div className="aspect-video bg-slate-900 overflow-hidden">
                    <img
                      src={currentFrame.imageUrl || "/placeholder.svg"}
                      alt={currentFrame.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-cyan-400 mb-4">{currentFrame.title}</h3>

                    <p className="text-slate-300 text-lg leading-relaxed mb-6 whitespace-pre-wrap">
                      {currentFrame.narration[currentVibe] || currentFrame.narration.professor}
                    </p>

                    {/* Audio Player */}
                    {currentFrame.narrationAudioUrl[currentVibe] && (
                      <div className="flex items-center gap-3 bg-slate-700/50 p-4 rounded-lg border border-slate-600">
                        <Headphones size={20} className="text-cyan-400" />
                        <audio controls src={currentFrame.narrationAudioUrl[currentVibe]} className="flex-1" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Navigation or End */}
                {!isEndOfTour ? (
                  <div className="bg-gradient-to-r from-slate-800 to-slate-700 border border-slate-600 rounded-xl p-6">
                    <h4 className="text-xl font-bold text-white mb-4">Where to next?</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {currentFrame.pathsForward.map((path) => (
                        <button
                          key={path.nextFrameId}
                          onClick={() => navigateToFrame(path.nextFrameId)}
                          className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
                        >
                          {path.nextFrameLabel || "Move Forward"}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-gradient-to-r from-slate-800 to-slate-700 border border-slate-600 rounded-xl p-8 text-center">
                    <p className="text-xl text-slate-300 mb-6">You have reached the end of this journey.</p>
                    <button
                      onClick={() => showGallery()}
                      className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
                    >
                      Finish Tour
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        )}
      </main>
    </div>
  )
}
