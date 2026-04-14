import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

interface ThemeContextType {
    isDark: boolean;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({ isDark: true, toggleTheme: () => {} });

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [isDark, setIsDark] = useState(() => {
        const stored = localStorage.getItem("parceros_theme");
        return stored !== "light";
    });

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.remove("light");
        } else {
            document.documentElement.classList.add("light");
        }
        localStorage.setItem("parceros_theme", isDark ? "dark" : "light");
    }, [isDark]);

    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme: () => setIsDark((p) => !p) }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}
