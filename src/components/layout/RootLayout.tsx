// src/components/layout/RootLayout.tsx
import type { ReactNode } from "react";
import { useTheme } from "../../store/themeStore";

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const { isDark, toggleTheme } = useTheme();
  
  return (
    <div className={`min-h-screen w-full transition-colors duration-300 ${
      isDark 
        ? 'bg-slate-950/80 text-slate-100' 
        : 'bg-gradient-to-br from-lime-50 via-green-50 to-emerald-50 text-gray-900'
    }`}>
      {/* 顶部栏 */}
      <header className={`w-full border-b transition-colors duration-300 ${
        isDark 
          ? 'bg-slate-950/90 border-lime-400/20 shadow-[0_0_40px_rgba(190,242,100,0.15)]'
          : 'bg-white/90 border-lime-500/20 shadow-md backdrop-blur-sm'
      }`}>
        <div className="mx-auto max-w-7xl px-3 md:px-6 py-2 md:py-3 flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className={`h-8 w-8 md:h-10 md:w-10 rounded-xl border flex items-center justify-center 
                text-[11px] md:text-xs font-bold transition-all duration-300 ${
                isDark
                  ? 'border-lime-400/60 bg-gradient-to-br from-lime-400 via-emerald-400 to-sky-500 text-slate-950 shadow-[0_0_20px_rgba(190,242,100,0.8)]'
                  : 'border-lime-500 bg-gradient-to-br from-lime-400 via-green-400 to-emerald-500 text-white shadow-lg'
              }`}>
                农
              </div>
              <div className="flex flex-col">
                <span className={`text-base md:text-xl font-semibold tracking-wide drop-shadow transition-colors ${
                  isDark ? 'text-lime-300' : 'text-lime-700'
                }`}>
                  智慧农田监测大屏
                </span>
                <span className={`text-[10px] md:text-xs transition-colors ${
                  isDark ? 'text-lime-200/80' : 'text-gray-600'
                }`}>
                  卫星遥感 · 物联网传感 · 光照智能控制
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* 主题切换按钮 */}
              <button
                onClick={toggleTheme}
                className={`group relative h-8 md:h-9 w-14 md:w-16 rounded-full border transition-all duration-300 ${
                  isDark
                    ? 'bg-slate-800 border-lime-400/40 hover:border-lime-400/60'
                    : 'bg-gradient-to-r from-lime-100 to-green-100 border-lime-400 hover:border-lime-500'
                }`}
                aria-label="切换主题"
              >
                <span className={`absolute inset-y-1 left-1 w-6 md:w-7 rounded-full transition-all duration-300 flex items-center justify-center text-xs ${
                  isDark 
                    ? 'translate-x-0 bg-gradient-to-br from-slate-600 to-slate-700' 
                    : 'translate-x-[26px] md:translate-x-[30px] bg-gradient-to-br from-yellow-300 to-amber-400'
                }`}>
                  {isDark ? '🌙' : '☀️'}
                </span>
              </button>
              
              <div className={`flex flex-col items-end text-[10px] md:text-xs transition-colors ${
                isDark ? 'text-lime-100/80' : 'text-gray-600'
              }`}>
                <span>{new Date().toLocaleDateString()}</span>
                <span className={`uppercase tracking-widest text-[9px] transition-colors ${
                  isDark ? 'text-lime-300' : 'text-lime-600'
                }`}>
                  DEMO · DIGITAL TWIN
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[9px] md:text-[10px]">
            <div className={`flex-1 h-[3px] rounded-full transition-colors ${
              isDark 
                ? 'bg-gradient-to-r from-lime-400 via-lime-300 to-lime-500'
                : 'bg-gradient-to-r from-lime-400 via-green-400 to-emerald-500'
            }`} />
            <span className={`px-2 py-[2px] rounded-full border transition-colors ${
              isDark
                ? 'border-lime-300/70 bg-lime-400/10 text-lime-200/80'
                : 'border-lime-500 bg-lime-50 text-lime-700'
            }`}>
              全景监测 · 安全运行中
            </span>
            <div className={`flex-1 h-[3px] rounded-full transition-colors ${
              isDark 
                ? 'bg-gradient-to-l from-lime-400 via-lime-300 to-lime-500'
                : 'bg-gradient-to-l from-lime-400 via-green-400 to-emerald-500'
            }`} />
          </div>
        </div>
      </header>

      {/* 主体区域 */}
      <main className="w-full px-2 md:px-4 pb-3 md:pb-5 pt-2 md:pt-3">
        <div className="mx-auto max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
}