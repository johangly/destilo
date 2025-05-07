'use client';

import { useState,useEffect } from 'react';
// import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';

export default function Login() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [message, setMessage] = useState('');
	const [theme, setTheme] = useState('light');

	// const router = useRouter();
	const { login } = useAuth();

	const handleLogin = async (e) => {
		e.preventDefault();
		setMessage('');

		try {
			const response = await fetch('/api/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ username, password }),
			});
			const data = await response.json();
			if (!response.ok) throw new Error(data.error);
			// 🔥 Guardar token en cookies para persistencia
			login(data.token, data.user);

			setMessage('Inicio de sesión exitoso.');
			// router.push('/home'); // 🔥 Redirigir a /home tras el login
		} catch (error) {
			setMessage('Usuario o contraseña incorrectos.');
		}
	};

	useEffect(() => {
		if (document && window) {
			const isDark = document.querySelector('html').classList.contains('dark');
			setTheme(isDark ? 'dark' : 'light');
		}
	}, []);

	return (
		<div className="flex flex-col items-center justify-center min-h-[calc(100vh-76px)] bg-gray-100 dark:bg-slate-800 p-5">
			<div className="bg-white dark:bg-slate-700 p-8 rounded-lg shadow-md w-full max-w-[400px] text-center mb-[76px]">
				<h1 className="text-slate-800 dark:text-slate-100 text-[2rem] mb-[20px]">Inicio de Sesión</h1>
				<Image
					src='/logoDarkMode.png'
					alt='Logo'
					width={200}
					height={70}
					className="hidden dark:inline mb-5"
				/>
				<Image
					src='/navbar-icon.png'
					alt='Logo'
					width={200}
					height={70}
					className="inline dark:hidden mb-5"
				/>
				<form onSubmit={handleLogin} className="flex flex-col">
					<div className="mb-4">
						<label className="block text-sm text-gray-700 dark:text-gray-200 mb-1">Usuario:</label>
						<input
							type='text'
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							required
							className="w-full p-2.5 text-base border border-gray-300 dark:border-gray-600 rounded-md mt-1 dark:bg-slate-600 dark:text-white"
						/>
					</div>
					<div className="mb-4">
						<label className="block text-sm text-gray-700 dark:text-gray-200 mb-1">Contraseña:</label>
						<input
							type='password'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							className="w-full p-2.5 text-base border border-gray-300 dark:border-gray-600 rounded-md mt-1 dark:bg-slate-600 dark:text-white"
						/>
					</div>
					<button 
						type='submit' 
						suppressHydrationWarning
						className="bg-green-500 hover:bg-green-600 text-white border-none py-3 rounded-md text-base cursor-pointer transition-colors duration-300"
					>
						Iniciar Sesión
					</button>
				</form>
				{message && <p className="mt-4 text-sm text-red-500">{message}</p>}
				<Link
					href='/recuperar-cuenta'
					className="mt-4 block text-sm text-blue-500 hover:underline"
				>
					¿Olvidaste tu contraseña?
				</Link>
			</div>
			<div className='fixed bottom-6 flex gap-5 justify-center items-center'>
				<Link 
					href="/soporte" 
					className="text-sm text-blue-500 hover:underline"
				>
					Soporte Tecnico
				</Link>
				<span className='font-light text-xl text-center'>|</span>
				<Link 
					href="/manual" 
					className="text-sm text-blue-500 hover:underline"
				>
					Manual de Usuario
				</Link>
			</div>
		</div>
	);
}
