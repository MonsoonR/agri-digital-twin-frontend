import type { ReactNode } from "react";

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className="h-screen w-screen bg-slate-900 text-slate-100">
      {/* 顶部栏 */}
      <header className="w-full flex items-center justify-between px-4 py-2 border-b border-slate-700">
        <h1 className="text-lg md:text-2xl font-semibold">
          农业数字孪生监测系统
        </h1>
        <div className="text-xs md:text-sm text-slate-400">
          {/* 这里后面可以改成实时时间 */}
          Demo · {new Date().toLocaleDateString()}
        </div>
      </header>

      {/* 主体：左右布局，移动端变上下 */}
      <main className="w-full h-[calc(100vh-48px)] p-2 md:p-4">
        <div className="h-full w-full flex flex-col md:flex-row gap-2 md:gap-4">
          {children}
        </div>
      </main>
    </div>
  );
}
