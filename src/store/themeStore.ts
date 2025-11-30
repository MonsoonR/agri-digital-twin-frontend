// src/store/themeStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

type ThemeStore = {
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
};

export const useTheme = create<ThemeStore>()(
  persist(
    (set) => ({
      isDark: true, // 默认暗色主题
      toggleTheme: () => set((state) => ({ isDark: !state.isDark })),
      setTheme: (isDark: boolean) => set({ isDark }),
    }),
    {
      name: "digital-twin-theme", // localStorage key
    }
  )
);