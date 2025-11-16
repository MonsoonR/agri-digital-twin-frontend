import type { ReactNode } from "react";

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className="min-h-screen w-full bg-slate-950/80 text-slate-100">
      {/* 顶部栏（保留原来的样式） */}
      <header className="w-full bg-slate-950/90 border-b border-lime-400/20 shadow-[0_0_40px_rgba(190,242,100,0.15)]">
        <div className="mx-auto max-w-7xl px-3 md:px-6 py-2 md:py-3 flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 md:h-10 md:w-10 rounded-xl border border-lime-400/60 bg-gradient-to-br from-lime-400 via-emerald-400 to-sky-500 flex items-center justify-center text-[11px] md:text-xs font-bold text-slate-950 shadow-[0_0_20px_rgba(190,242,100,0.8)]">
                农
              </div>
              <div className="flex flex-col">
                <span className="text-base md:text-xl font-semibold text-lime-300 tracking-wide drop-shadow">
                  智慧农田监测大屏
                </span>
                <span className="text-[10px] md:text-xs text-lime-200/80">
                  卫星遥感 · 物联网传感 · 光照智能控制
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end text-[10px] md:text-xs text-lime-100/80">
              <span>{new Date().toLocaleDateString()}</span>
              <span className="uppercase tracking-widest text-[9px] text-lime-300">
                DEMO · DIGITAL TWIN
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[9px] md:text-[10px] text-lime-200/80">
            <div className="flex-1 h-[3px] bg-gradient-to-r from-lime-400 via-lime-300 to-lime-500 rounded-full" />
            <span className="px-2 py-[2px] rounded-full border border-lime-300/70 bg-lime-400/10">
              全景监测 · 安全运行中
            </span>
            <div className="flex-1 h-[3px] bg-gradient-to-l from-lime-400 via-lime-300 to-lime-500 rounded-full" />
          </div>
        </div>
      </header>

      {/* 主体区域：不再固定高度，允许内容自然撑高 */}
      <main className="w-full px-2 md:px-4 pb-3 md:pb-5 pt-2 md:pt-3">
        <div className="mx-auto max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
}
