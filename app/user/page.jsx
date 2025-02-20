'use client';

import React from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import { useAuth } from '@/context/AuthContext'; // 🔥 Importa el contexto de autenticación

function Page() {
	const { logout } = useAuth(); // 🔥 Usa la función de logout del contexto

	return (
		<div className={styles.container}>
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
	);
}

export default Page;
