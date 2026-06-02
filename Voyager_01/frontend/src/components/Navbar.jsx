"use client"

import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { FaTimes } from "react-icons/fa"
import { useTranslation } from "react-i18next"
import LanguageChanger from "./LanguageChanger"
import { useAppContext } from "../context/AppContext"
import Profile from "../pages/Profile"
import { Search, Menu, User, MapPin, ChevronRight, LayoutGrid } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const searchDestinations = [
  { name: "Bishnupur", path: "/bishupur" },
  { name: "Doars", path: "/doars" },
  { name: "Jhargram", path: "/jhargram" },
  { name: "Kankrajhor", path: "/kankrajhor" },
  { name: "Ayodha Pahar", path: "/AyodhaPahar" },
  { name: "Jaldapara National Park", path: "/jaldapara" },
  { name: "Sandakhpu", path: "/sandakhpu" },
  { name: "Kalimpong", path: "/kalimpong" },
  { name: "Purulia", path: "/purulia" },
  { name: "Kashmir", path: "/kashmir" },
  { name: "Delhi", path: "/delhi" },
  { name: "Paris", path: "/paris" },
  { name: "Kerala", path: "/kerala" },
  { name: "Andaman", path: "/andaman" },
  { name: "Digha", path: "/digha" },
  { name: "Monuments", path: "/monuments" },
]

const sidebarItemsMapping = [
  { label: "navbar.sidebarItems.home", path: "/home" },
  { label: "navbar.sidebarItems.weather", path: "/weather" },
  { label: "navbar.sidebarItems.map", path: "/map" },
  { label: "navbar.sidebarItems.booking", path: "/booking" },
  { label: "navbar.sidebarItems.community", path: "/community" },
  { label: "navbar.sidebarItems.emergency", path: "/emergency" },
  { label: "navbar.sidebarItems.contact", path: "/contact" },
  { label: "Monuments", path: "/monuments" },
]

const Navbar = () => {
  const { profileOpen, setProfileOpen, sidebarOpen, setSidebarOpen, userDetails } = useAppContext()
  const location = useLocation()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { user } = useAppContext()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [showResults, setShowResults] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSearchChange = (e) => {
    const query = e.target.value
    setSearchQuery(query)
    if (query.length > 0) {
      const results = searchDestinations.filter((destination) =>
        destination.name.toLowerCase().includes(query.toLowerCase()),
      )
      setSearchResults(results)
      setShowResults(true)
    } else {
      setSearchResults([])
      setShowResults(false)
    }
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchResults.length > 0) {
      navigate(searchResults[0].path)
      setSearchQuery("")
      setShowResults(false)
    }
  }

  return (
    <>
      <nav
        className={`fixed w-full h-20 top-0 z-[60] transition-all duration-700 flex items-center ${scrolled
            ? "bg-[#0a0a0c]/80 backdrop-blur-2xl border-b border-white/5 shadow-2xl"
            : "bg-transparent border-b border-white/0"
          }`}
      >
        <div className="max-w-[1440px] w-full mx-auto px-6 md:px-12 flex justify-between items-center h-full">
          {/* Menu & Brand */}
          <div className="flex items-center gap-8">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-3 bg-white/5 text-slate-300 border border-white/10 rounded-2xl shadow-xl hover:bg-white/10 transition-all"
            >
              <Menu size={20} />
            </motion.button>

            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tighter text-white">
                VOYAGER<span className="text-cyan-500">.</span>
              </span>
            </Link>
          </div>

          {/* Search HUD - Premium Layout */}
          <div className="hidden lg:flex flex-1 max-w-md mx-12 relative">
            <form onSubmit={handleSearchSubmit} className="w-full relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-cyan-400 transition-colors" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Synchronize target..."
                className="w-full py-3.5 pl-12 pr-6 rounded-2xl text-sm font-bold bg-white/5 text-white placeholder:text-white/20 border border-white/10 focus:border-cyan-500/30 focus:bg-white/10 focus:ring-0 transition-all outline-none"
              />
            </form>

            <AnimatePresence>
              {showResults && searchResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute top-full left-0 right-0 bg-[#0a0a0c] border border-white/10 rounded-2xl mt-4 shadow-2xl p-2 z-[70] backdrop-blur-3xl"
                >
                  {searchResults.map((result, index) => (
                    <button
                      key={index}
                      className="w-full flex items-center gap-3 px-4 py-4 rounded-xl hover:bg-white/5 text-white/60 hover:text-white transition-all text-xs font-bold"
                      onClick={() => {
                        navigate(result.path)
                        setSearchQuery("")
                        setShowResults(false)
                      }}
                    >
                      <MapPin size={14} className="text-cyan-400" />
                      {result.name}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Utilities */}
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-1 text-white font-bold">
              <LanguageChanger />
            </div>

            {user ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setProfileOpen(true)}
                className="flex items-center gap-3 pl-2 pr-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-white shadow-xl hover:bg-white/10 transition-all"
              >
                <div className="w-8 h-8 rounded-xl overflow-hidden shadow-inner bg-slate-800">
                  <img src={userDetails?.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"} alt="user" className="w-full h-full object-cover" />
                </div>
                <span className="text-xs font-black uppercase tracking-widest">{userDetails?.name?.split(" ")[0]}</span>
              </motion.button>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-xs font-black uppercase tracking-[0.2em] text-white/40 hover:text-white px-6 py-3 rounded-2xl transition-all">
                  {t("navbar.login")}
                </Link>
                <Link to="/register" className="bg-cyan-600 text-white px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-cyan-500/20 hover:bg-cyan-500 transition-all">
                  {t("navbar.register")}
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Cybernetic Sidebar - Reverted to HUD aesthetic */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-[360px] bg-[#0a0a0c] z-[110] shadow-2xl border-r border-white/5 flex flex-col p-10"
            >
              <div className="flex items-center justify-between mb-16">
                <span className="text-2xl font-black tracking-tighter text-white">
                  VOYAGER<span className="text-cyan-500">.</span>
                </span>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-3 bg-white/5 text-white/40 hover:text-white border border-white/10 rounded-2xl transition-all shadow-xl"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="flex-1 space-y-12">
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] px-4">Navigation Network</p>
                  <nav className="space-y-2">
                    {sidebarItemsMapping.map((item, i) => (
                      <Link
                        key={i}
                        to={user == null ? "/login" : item.path}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center justify-between p-5 rounded-3xl transition-all group ${location.pathname === item.path
                            ? "bg-cyan-600/10 text-cyan-400 border border-cyan-500/20"
                            : "text-white/40 hover:bg-white/5 hover:text-white"
                          }`}
                      >
                        <span className="text-sm font-black uppercase tracking-tight">{t(item.label)}</span>
                        <ChevronRight
                          size={16}
                          className={`transition-transform duration-500 ${location.pathname === item.path ? "text-cyan-400" : "text-white/10 group-hover:translate-x-1"
                            }`}
                        />
                      </Link>
                    ))}
                  </nav>
                </div>
              </div>

              {user && user.role === "owner" && (
                <Link
                  to="/hotelApp"
                  onClick={() => setSidebarOpen(false)}
                  className="mt-8 bg-white/5 p-8 rounded-[2.5rem] border border-white/5 group transition-all"
                >
                  <div className="flex flex-col gap-4">
                    <div className="bg-cyan-600/20 w-fit p-3 rounded-2xl">
                      <LayoutGrid size={20} className="text-cyan-400" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-1">Administrative Matrix</p>
                      <p className="text-lg font-black uppercase tracking-tighter text-white">Owner Section</p>
                    </div>
                  </div>
                </Link>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Profile isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
    </>
  )
}

export default Navbar
