import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("theme") || "light",
  setTheme: (theme) => {
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
    set({ theme });
  }
}));

// Initialize theme as soon as the module loads
if (typeof document !== 'undefined') {
  const savedTheme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);
}