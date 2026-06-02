"use client"

import { useState } from "react"
import { MessageCircle, Heart, Share2, MapPin, Calendar, MoreHorizontal, ArrowRight, Bookmark } from "lucide-react"
import { Button } from "../components/ui/Button"
import { Badge } from "../components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Textarea } from "../components/ui/textarea"
import { motion, AnimatePresence } from "framer-motion"

const PostCard = ({ post, onLike }) => {
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState("")

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.content,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert("Link copied to clipboard!")
    }
  }

  const handleComment = () => {
    if (newComment.trim()) {
      setNewComment("")
      setShowComments(true)
    }
  }

  return (
    <div className="bg-white rounded-[3.5rem] overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:border-cyan-500/20 transition-all duration-700 group/post">
      {/* Post Header HUD */}
      <div className="p-10 pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="relative">
              <Avatar className="w-16 h-16 border-2 border-white shadow-xl">
                <AvatarImage src={post.author.avatar} alt={post.author.name} className="object-cover" />
                <AvatarFallback className="bg-slate-100 font-black text-slate-900">
                  {post.author.name.split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 border-4 border-white rounded-full" />
            </div>
            <div>
              <h4 className="text-xl font-black text-slate-950 uppercase tracking-tight leading-none mb-2">{post.author.name}</h4>
              <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <span className="flex items-center gap-1.5"><MapPin size={12} className="text-cyan-600" /> {post.author.location}</span>
                <span className="w-1 h-1 bg-slate-200 rounded-full" />
                <span className="flex items-center gap-1.5"><Calendar size={12} /> {post.date}</span>
              </div>
            </div>
          </div>
          <button className="p-4 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-2xl hover:bg-white border border-slate-50 hover:border-slate-100 transition-all shadow-inner">
            <MoreHorizontal size={20} />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="px-10 space-y-8">
        {/* Title & Classification */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="h-[2px] w-8 bg-cyan-600" />
              <span className="text-[10px] font-black text-cyan-700 uppercase tracking-[0.3em]">{post.destination}</span>
            </div>
            <h3 className="text-4xl font-black text-slate-950 tracking-tighter uppercase leading-tight">{post.title}</h3>
          </div>
          <Badge className="bg-slate-900 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-cyan-600 transition-all border-none">
            {post.category}
          </Badge>
        </div>

        {/* Narrative Body */}
        <p className="text-slate-600 text-xl font-bold italic leading-relaxed border-l-4 border-cyan-500/20 pl-8">
          "{post.content}"
        </p>

        {/* Visual Assets Grid */}
        {post.images.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {post.images.map((image, index) => (
              <div key={index} className="rounded-[2.5rem] overflow-hidden group/img relative shadow-xl">
                <img
                  src={image}
                  alt={`Transmission asset ${index + 1}`}
                  className="w-full h-80 object-cover transition-transform duration-1000 group-hover/img:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        )}

        {/* Metadata Tokens */}
        <div className="flex flex-wrap gap-3 pb-2">
          {post.tags.map((tag) => (
            <span key={tag} className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl border border-slate-100 group-hover/post:border-cyan-500/20 transition-all">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Interactive HUD Row */}
      <div className="p-10 pt-6">
        <div className="flex items-center justify-between gap-8 pt-8 border-t border-slate-100">
          <div className="flex items-center gap-4">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => onLike(post.id)}
              className={`flex items-center gap-3 px-8 py-4 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest transition-all ${post.isLiked ? "bg-rose-600 text-white shadow-lg shadow-rose-200" : "bg-slate-50 text-slate-400 hover:bg-white hover:text-rose-600 border border-slate-50 hover:border-rose-100 shadow-inner"}`}
            >
              <Heart size={16} className={post.isLiked ? "fill-current" : ""} />
              {post.likes}
            </motion.button>

            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-3 px-8 py-4 rounded-[1.5rem] bg-slate-50 text-slate-400 hover:bg-white hover:text-cyan-600 border border-slate-50 hover:border-cyan-100 shadow-inner font-black text-[11px] uppercase tracking-widest transition-all"
            >
              <MessageCircle size={16} />
              {post.comments}
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleShare}
              className="p-4 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-2xl hover:bg-white border border-slate-50 hover:border-slate-100 transition-all shadow-inner"
            >
              <Share2 size={18} />
            </button>
            <button className="p-4 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-2xl hover:bg-white border border-slate-50 hover:border-slate-100 transition-all shadow-inner">
              <Bookmark size={18} />
            </button>
          </div>
        </div>

        {/* Comment System Viewport */}
        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-8 pt-8 overflow-hidden"
            >
              <div className="flex gap-5">
                <Avatar className="w-12 h-12 border-2 border-white shadow-lg">
                  <AvatarFallback className="bg-slate-900 text-white font-black text-xs">YOU</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-4">
                  <Textarea
                    placeholder="Broadcast your feedback..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="min-h-[100px] bg-slate-50 border-slate-100 rounded-3xl p-6 text-slate-900 placeholder:text-slate-400 font-bold focus:bg-white focus:border-cyan-500/30 transition-all outline-none"
                  />
                  <Button onClick={handleComment} className="bg-slate-950 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-cyan-600 shadow-xl transition-all h-auto">
                    Post Command <ArrowRight size={14} className="ml-2" />
                  </Button>
                </div>
              </div>

              {/* Sample Comment Segment */}
              <div className="space-y-6 pl-16">
                <div className="flex gap-5">
                  <Avatar className="w-10 h-10 border-2 border-white shadow-lg">
                    <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100">
                      <h5 className="font-black text-slate-950 text-sm uppercase tracking-tight mb-2">John Expeditionary</h5>
                      <p className="text-slate-600 text-lg font-bold italic leading-relaxed">
                        "Elite capture! I'm initiating a trajectory for this sector next lunar cycle. Any logistical insights for high-altitude zones?"
                      </p>
                    </div>
                    <div className="flex items-center gap-6 mt-4 ml-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <span className="text-cyan-600">Active: 2h ago</span>
                      <button className="hover:text-cyan-600 transition-colors">System Reply</button>
                      <button className="hover:text-rose-600 transition-colors">Signal Like</button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default PostCard
