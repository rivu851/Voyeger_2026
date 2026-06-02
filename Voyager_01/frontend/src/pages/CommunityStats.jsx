import { Users, MapPin, MessageCircle, Heart, Zap, Globe, Target, ShieldCheck } from "lucide-react"

const CommunityStats = () => {
  const stats = [
    {
      icon: Users,
      label: "Active Voyagers",
      value: "12,450",
      color: "text-cyan-600",
      bg: "bg-cyan-50",
      border: "border-cyan-100"
    },
    {
      icon: Globe,
      label: "Sectors Mapped",
      value: "2,340",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-100"
    },
    {
      icon: Target,
      label: "Mission Echoes",
      value: "8,920",
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      border: "border-indigo-100"
    },
    {
      icon: ShieldCheck,
      label: "System Trust Index",
      value: "99.8%",
      color: "text-rose-600",
      bg: "bg-rose-50",
      border: "border-rose-100"
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:border-cyan-500/20 transition-all duration-700 group cursor-default"
        >
          <div className="flex flex-col items-center text-center space-y-6">
            <div className={`p-5 rounded-3xl ${stat.bg} ${stat.border} border shadow-inner group-hover:scale-110 transition-transform duration-500`}>
              <stat.icon className={`w-8 h-8 ${stat.color} group-hover:animate-pulse`} />
            </div>
            <div className="space-y-1">
              <div className="text-4xl font-black text-slate-950 tracking-tighter uppercase leading-none">{stat.value}</div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] pt-2">{stat.label}</div>
            </div>
            <div className="w-12 h-1.5 bg-slate-50 rounded-full overflow-hidden">
              <div className={`h-full ${stat.color.replace('text', 'bg')} w-2/3 group-hover:w-full transition-all duration-1000`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default CommunityStats
