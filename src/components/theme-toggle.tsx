"use client";

import { useTheme } from "./theme-provider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  const getIcon = () => {
    if (theme === "light") {
      return "☀️";
    } else if (theme === "dark") {
      return "🌙";
    } else {
      return "💻";
    }
  };

  const getLabel = () => {
    if (theme === "light") {
      return "Light";
    } else if (theme === "dark") {
      return "Dark";
    } else {
      return "System";
    }
  };

  return (
    <button
      onClick={cycleTheme}
      className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors text-sm font-medium"
      title={`Current theme: ${getLabel()}. Click to cycle.`}
    >
      <span className="text-lg">{getIcon()}</span>
      <span className="hidden sm:inline">{getLabel()}</span>
    </button>
  );
}
