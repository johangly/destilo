'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';
import { useAuth } from '@/context/AuthContext';
export default function Login() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [message, setMessage] = useState('');
	const router = useRouter();
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
			console.log('Login usuario', data)
			if (!response.ok) throw new Error(data.error);
			// 🔥 Guardar token en cookies para persistencia
			login(data.token, data.user);

			setMessage('Inicio de sesión exitoso.');
			// router.push('/home'); // 🔥 Redirigir a /home tras el login
		} catch (error) {
			setMessage('Usuario o contraseña incorrectos.');
		}
	};

	return (
		<div className={styles.container}>
			<div className={styles.formWrapper}>
				<h1>Inicio de Sesión</h1>
				<Image
					src='/navbar-icon.svg'
					alt='Logo'
					width={200}
					height={70}
				/>
				<form onSubmit={handleLogin}>
					<div>
						<label>Usuario:</label>
						<input
							type='text'
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							required
						/>
					</div>
					<div>
						<label>Contraseña:</label>
						<input
							type='password'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</div>
					<button type='submit'>Iniciar Sesión</button>
				</form>
				{message && <p className={styles.message}>{message}</p>}
				<Link
					href='/reset-password'
					className={styles.link}
				>
					¿Olvidaste tu contraseña?
				</Link>
			</div>
		</div>
	);
}
