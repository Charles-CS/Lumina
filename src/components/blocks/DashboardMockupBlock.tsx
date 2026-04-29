import React from "react";
import { BlockPreviewProps } from "./BlockPrimitives";
import { BarChart2, Bell, Settings, Users, TrendingUp, Inbox } from "lucide-react";

export function DashboardMockupBlock({ title, subtitle, baseColor, visuals, dashboardNav: propDashboardNav, dashboardStats: propDashboardStats }: BlockPreviewProps) {
  const accent = baseColor || "#a78bfa";
  const radius = visuals?.borderRadius ? `${visuals?.borderRadius}px` : "24px";

  const navItems = propDashboardNav || [
    { icon: BarChart2, label: "Overview", active: true },
    { icon: Users, label: "Customers", active: false },
    { icon: Inbox, label: "Inbox", active: false },
    { icon: Settings, label: "Settings", active: false },
  ];

  const stats = propDashboardStats || [
    { label: "Total Revenue", value: "$128,430", change: "+12.4%", up: true },
    { label: "Active Users", value: "24,801", change: "+5.1%", up: true },
    { label: "Churn Rate", value: "1.8%", change: "-0.3%", up: false },
  ];

  return (
    <div className="w-full py-12 @md:py-20 px-4 @md:px-6 relative">
      <div className="max-w-5xl mx-auto flex flex-col items-center gap-10 text-center">
        <div className="flex flex-col gap-3">
          <span className="text-sm font-bold tracking-widest uppercase" style={{ color: accent }}>
            {subtitle || "App Preview"}
          </span>
          <h2 className="text-3xl @md:text-5xl font-bold tracking-tight text-white">
            {title || "Your command center."}
          </h2>
        </div>

        {/* Mock Dashboard Window */}
        <div
          className="w-full max-w-4xl border border-white/10 overflow-hidden shadow-2xl relative"
          style={{
            borderRadius: radius,
            boxShadow: `0 40px 80px rgba(0,0,0,0.6), 0 0 60px ${accent}15`,
            backgroundColor: (visuals?.cardBackgroundColor === "transparent" ? "transparent" : (visuals?.cardBackgroundColor || "#0a0a0a")) as string
          }}
        >
          {/* Window Chrome */}
          <div
            className="flex items-center px-5 py-3 border-b border-white/5"
            style={{
              backgroundColor: (visuals?.cardBackgroundColor === "transparent" ? "transparent" : (visuals?.cardBackgroundColor || "#0d0d0d")) as string
            }}
          >
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <div className="w-3 h-3 rounded-full bg-green-500/70" />
            </div>
            <div className="mx-auto flex items-center gap-3 bg-black/30 border border-white/5 rounded-md px-4 py-1">
              <span className="text-[11px] font-mono text-white/25">app.lumina.dev/dashboard</span>
            </div>
            <Bell size={14} className="text-white/25" />
          </div>

          {/* Dashboard Body */}
          <div className="flex h-72">
            {/* Sidebar */}
            <div className="w-16 @md:w-48 flex flex-col gap-1 p-3 border-r border-white/5 bg-black/20 flex-shrink-0">
              <div className="flex items-center gap-2 px-3 py-2 mb-3">
                <div className="w-5 h-5 rounded-md" style={{ backgroundColor: accent }} />
                <span className="text-xs font-bold text-white/70">Lumina</span>
              </div>
              {navItems.map(({ icon: Icon, iconName, label, active }) => {
                const navIcon = Icon || (iconName === 'Users' ? Users : iconName === 'Inbox' ? Inbox : iconName === 'Settings' ? Settings : BarChart2);
                return (
                  <div
                    key={label}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${active ? "bg-white/10 text-white" : "text-white/30 hover:text-white/60"
                      }`}
                  >
                    {navIcon && React.createElement(navIcon, { size: 13 })}
                    {label}
                  </div>
                )
              })}
            </div>

            {/* Main Content */}
            <div className="flex-1 p-5 flex flex-col gap-4 overflow-hidden">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white/80">Overview</h3>
                <div className="flex gap-2">
                  {["7d", "30d", "90d"].map((p, i) => (
                    <span
                      key={p}
                      className={`text-[10px] px-2 py-0.5 rounded-md font-medium cursor-pointer ${i === 1 ? "text-white bg-white/10 border border-white/10" : "text-white/25 hover:text-white/50"}`}
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stats Micro-cards */}
              <div className="grid grid-cols-1 @sm:grid-cols-3 gap-3">
                {stats.map((s) => (
                  <div key={s.label} className="p-3 rounded-xl bg-black/30 border border-white/5 flex flex-col gap-1">
                    <span className="text-[9px] uppercase tracking-widest text-white/25 font-bold">{s.label}</span>
                    <span className="text-lg font-bold text-white tracking-tight">{s.value}</span>
                    <span
                      className={`text-[10px] font-semibold flex items-center gap-1 ${s.up ? "text-emerald-400" : "text-red-400"}`}
                    >
                      <TrendingUp size={9} />
                      {s.change}
                    </span>
                  </div>
                ))}
              </div>

              {/* Chart Skeleton */}
              <div className="flex-1 rounded-xl border border-white/5 bg-black/20 p-4 flex items-end gap-1.5 overflow-hidden">
                {[40, 65, 45, 80, 55, 90, 70, 95, 60, 85, 75, 100].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t-sm transition-all"
                    style={{ height: `${h}%`, backgroundColor: `${accent}${i % 3 === 2 ? "cc" : "30"}` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
