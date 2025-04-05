'use client';

import React from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import { useAuth } from '@/context/AuthContext'; // 🔥 Importa el contexto de autenticación
import Container from '@/components/Container';

function Page() {
	const { logout } = useAuth(); // 🔥 Usa la función de logout del contexto

	return (
		<Container>
		<div className={`${styles.container} bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 border-1 border-slate-300 dark:border-slate-500 rounded`}>
			<h1>Opciones de usuario</h1>
			<div className={styles.linkContainer}>
				<Link
					href='/'
					className={styles.link}
				>
					Iniciar Sesión
				</Link>
				<Link
					href='/reset-password'
					className={styles.link}
				>
					Cambiar Contraseña
				</Link>
				{/* 🔥 Botón para cerrar sesión */}
				<button
					onClick={logout}
					className={styles.logoutButton}
				>
					Cerrar Sesión
				</button>
			</div>
		</div>
		</Container>
	);
}

export default Page;
