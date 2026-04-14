import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

interface Usuario {
    id: string;
    nombre: string;
    correo: string;
    rol: "worker" | "employer";
}

interface AuthContextType {
    usuario: Usuario | null;
    token: string | null;
    login: (token: string, usuario: Usuario) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

function getStoredAuth(): { token: string | null; usuario: Usuario | null } {
    const storedToken = localStorage.getItem("token");
    const storedUsuario = localStorage.getItem("usuario");
    if (storedToken && storedUsuario) {
        return { token: storedToken, usuario: JSON.parse(storedUsuario) as Usuario };
    }
    return { token: null, usuario: null };
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const stored = getStoredAuth();
    const [usuario, setUsuario] = useState<Usuario | null>(stored.usuario);
    const [token, setToken] = useState<string | null>(stored.token);

    const login = (newToken: string, newUsuario: Usuario) => {
        localStorage.setItem("token", newToken);
        localStorage.setItem("usuario", JSON.stringify(newUsuario));
        setToken(newToken);
        setUsuario(newUsuario);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        setToken(null);
        setUsuario(null);
    };

    return (
        <AuthContext.Provider
            value={{
                usuario,
                token,
                login,
                logout,
                isAuthenticated: !!token,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth debe usarse dentro de AuthProvider");
    }
    return context;
}