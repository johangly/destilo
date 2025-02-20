'use client';

import { createContext, useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const router = useRouter();

	useEffect(() => {
		// Leer token de las cookies
		const token = document.cookie
			.split('; ')
			.find((row) => row.startsWith('token='))
			?.split('=')[1];

		if (!token) {
			setUser(null);
		} else {
			setUser({ token }); // Puedes mejorar esto con una API para obtener más datos del usuario
		}
	}, []);

	const logout = () => {
		document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
		setUser(null);
		router.push('/');
	};

	return (
		<AuthContext.Provider value={{ user, logout }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	return useContext(AuthContext);
}
