"use client"

import { useState } from "react"
import { Users, Plus, Search, Filter } from "lucide-react"
import { Button } from "../components/ui/Button"
import { Card, CardContent, CardHeader } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Badge } from "../components/ui/badge"
import PostCard from "../pages/PostCard"
import CreatePost from "../pages/CreatePost"
import CommunityStats from "./CommunityStats"
import { useNavigate } from "react-router-dom"
import { useAppContext } from "../context/AppContext"
import { useTranslation } from "react-i18next"
import { motion, AnimatePresence } from "framer-motion"

const Community = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("feed")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const { createCom, setCreateCom } = useAppContext();
  const navigate = useNavigate();

  const [posts, setPosts] = useState([
    {
      id: "1",
      author: {
        name: t('community.posts.sarah.name'),
        avatar: "https://plus.unsplash.com/premium_photo-1690407617542-2f210cf20d7e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D",
        location: t('community.posts.sarah.location'),
      },
      destination: t('community.posts.sarah.destination'),
      title: t('community.posts.sarah.title'),
      content: t('community.posts.sarah.content'),
      images: ["https://plus.unsplash.com/premium_photo-1671358446946-8bd43ba08a6a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8Z29hJTIwYmVhY2h8ZW58MHx8MHx8fDA%3D", "https://images.unsplash.com/photo-1606203627178-c7bec545dff1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGdvYSUyMGJlYWNofGVufDB8fDB8fHww", "https://plus.unsplash.com/premium_photo-1666286956135-0fb603dad5cf?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGdvYSUyMGJlYWNofGVufDB8fDB8fHww"],
      category: t('community.categories.beach'),
      date: t('community.timeAgo.days', { count: 2 }),
      likes: 24,
      comments: 8,
      tags: [t('community.tags.beach'), t('community.tags.hiddenGems'), t('community.tags.seafood'), t('community.tags.sunset')],
      isLiked: false,
    },
    {
      id: "2",
      author: {
        name: t('community.posts.raj.name'),
        avatar: "https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D",
        location: t('community.posts.raj.location'),
      },
      destination: t('community.posts.raj.destination'),
      title: t('community.posts.raj.title'),
      content: t('community.posts.raj.content'),
      images: ["https://images.unsplash.com/photo-1600438831035-48f5f196d3bf?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bGFkYWtofGVufDB8fDB8fHww", "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bGFkYWtofGVufDB8fDB8fHww"],
      category: t('community.categories.adventure'),
      date: t('community.timeAgo.week', { count: 1 }),
      likes: 45,
      comments: 12,
      tags: [t('community.tags.soloTravel'), t('community.tags.adventure'), t('community.tags.mountains'), t('community.tags.biking')],
      isLiked: true,
    },
  ])

  const categories = [
    t('community.categories.all'),
    t('community.categories.beach'),
    t('community.categories.adventure'),
    t('community.categories.heritage'),
    t('community.categories.hillStation'),
    t('community.categories.wildlife'),
    t('community.categories.spiritual')
  ]

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === t('community.categories.all') || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleLike = (postId) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? { ...post, likes: post.isLiked ? post.likes - 1 : post.likes + 1, isLiked: !post.isLiked }
          : post,
      ),
    )
  }

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto">
        {/* Header Area */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-20 px-4">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-[2px] w-12 bg-cyan-600 shadow-[0_0_15px_rgba(8,145,178,0.2)]" />
              <span className="text-cyan-800 font-black uppercase tracking-[0.5em] text-[10px]">Transmission Hub</span>
            </div>
            <h2 className="text-6xl md:text-8xl font-black text-slate-950 tracking-tighter leading-none">
              GLOBAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 italic">TRANSMISSIONS</span>
            </h2>
            <p className="text-slate-500 text-xl font-bold max-w-2xl italic leading-relaxed">
              "Witness the echoes of the unknown, captured by the fearless voyagers of the grand frontier."
            </p>
          </div>

          <div className="flex items-center gap-6">
            <Button
              onClick={() => setActiveTab("feed")}
              className={`rounded-[2rem] px-10 py-8 h-auto font-black uppercase tracking-[0.2em] text-[10px] transition-all shadow-xl ${activeTab === "feed" ? "bg-slate-950 text-white shadow-slate-200" : "text-slate-500 hover:text-slate-950 bg-white border border-slate-100"
                }`}
            >
              <Users className="w-5 h-5 mr-4" />
              {t('community.tabs.feed')}
            </Button>
            <Button
              onClick={() => setCreateCom(true)}
              className="rounded-[2rem] px-10 py-8 h-auto font-black uppercase tracking-[0.2em] text-[10px] bg-cyan-600 text-white hover:bg-cyan-700 shadow-xl shadow-cyan-500/20 border-none active:scale-95 transition-all"
            >
              <Plus className="w-5 h-5 mr-4" />
              {t('community.tabs.share')}
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mb-24 px-4">
          <CommunityStats />
        </div>

        {/* Feed Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 px-4">
          {/* Sidebar Filters */}
          <aside className="lg:col-span-3 space-y-12">
            <div className="bg-white border border-slate-100 rounded-[4rem] p-12 space-y-12 sticky top-28 shadow-xl shadow-slate-200/40">
              <div className="space-y-10">
                <div className="flex items-center gap-4 text-slate-400 uppercase tracking-[0.3em] text-[10px] font-black">
                  <Search size={16} className="text-cyan-600" /> Sector Search
                </div>
                <div className="relative">
                  <Input
                    placeholder={t('community.filters.searchPlaceholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-slate-50 border-slate-100 rounded-[2rem] py-7 pl-6 text-slate-900 placeholder:text-slate-400 font-black text-xs tracking-widest focus:bg-white focus:border-cyan-500/30 outline-none transition-all h-auto shadow-inner"
                  />
                </div>
              </div>

              <div className="space-y-10">
                <div className="flex items-center gap-4 text-slate-400 uppercase tracking-[0.3em] text-[10px] font-black">
                  <Filter size={16} className="text-cyan-600" /> Classification
                </div>
                <div className="flex flex-col gap-3">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`text-left px-8 py-5 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest transition-all ${selectedCategory === category
                        ? "bg-cyan-600 text-white shadow-lg shadow-cyan-500/30"
                        : "text-slate-500 hover:text-slate-950 hover:bg-slate-50 border border-transparent hover:border-slate-100"
                        }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="lg:col-span-9">
            <div className="grid grid-cols-1 gap-16">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <PostCard post={post} onLike={handleLike} />
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-48 bg-slate-50 rounded-[5rem] border-4 border-dashed border-slate-100 opacity-40">
                  <Users className="w-24 h-24 mx-auto mb-10 text-slate-200" />
                  <h3 className="text-4xl font-black text-slate-800 mb-4 uppercase tracking-tighter">Negative Signal</h3>
                  <p className="text-slate-400 italic font-bold text-xl uppercase tracking-widest">No transmissions detected on the current frequency.</p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </section>
  )
}

export default Community