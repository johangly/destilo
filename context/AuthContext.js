'use client';

import { createContext, useState, useEffect, useContext } from 'react';
import { useRouter,usePathname } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

const TOKEN_NAME = 'token';
const TOKEN_EXPIRY_MARGIN = 300; // 5 minutos en segundos

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();
    const pathname = usePathname();
    const publicRoutes = ['/', '/reset-password', '/about', '/contact','/activar-cuenta/:token','/reset-password/:token'];
    const isPublicRoute = publicRoutes.some((route) => {
        if (route.includes(':token')) {
            const routePattern = new RegExp(`^${route.replace(':token', '[^/]+')}$`);
            return routePattern.test(pathname);
        }
        return route === pathname;
    });
    const isTokenExpired = (token) => {
        try {
            const decoded = jwtDecode(token);
            const currentTime = Math.floor(Date.now() / 1000);
            return decoded.exp < (currentTime + TOKEN_EXPIRY_MARGIN);
        } catch (error) {
            console.error('Error al intentar decodificar el token de autenticaci n:', error);
            return true;
        }
    };

    const setToken = (token) => {
        if (token) {
            document.cookie = `${TOKEN_NAME}=${token}; path=/; max-age=86400; secure; samesite=strict`;
        }
    };

    const getToken = () => {
        const token = document.cookie
            .split('; ')
            .find((row) => row.startsWith(`${TOKEN_NAME}=`))
            ?.split('=')[1];
        return token;
    };

    const login = async (token, userData) => {
        try {
            setToken(token);
            setUser({ ...userData, token });
            router.push('/home');
        } catch (err) {
            setError('Error al iniciar sesión');
            console.error('Error en login:', err);
        }
    };

    const logout = () => {
        try {
            document.cookie = `${TOKEN_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
            setUser(null);
            if(!isPublicRoute){
                router.push('/');
            }
        } catch (err) {
            console.error('Error en logout:', err);
        }
    };

    useEffect(() => {
        const initAuth = async () => {
            try {
                setLoading(true);
                const token = getToken();
                if (!token || isTokenExpired(token)) {
                    console.log('logout')
                    logout();
                    return;
                }

                // Aquí podrías hacer una llamada a tu API para obtener los datos del usuario
                const decoded = jwtDecode(token);
                setUser({ ...decoded, token });
            } catch (err) {
                setError('Error al inicializar la autenticación');
                console.error('Error en initAuth:', err);
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ 
            user, 
            loading, 
            error,
            login,
            logout,
            isAuthenticated: !!user 
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
}
