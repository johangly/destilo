'use client';

import React from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import { useAuth } from '@/context/AuthContext'; // 🔥 Importa el contexto de autenticación
import Container from '@/components/Container';
import BackButton from '@/components/BackButton';

function Page() {
	const { logout } = useAuth(); // 🔥 Usa la función de logout del contexto

	return (
		<Container>
		<div className={`${styles.container} bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 border-1 border-slate-300 dark:border-slate-500 rounded`}>
			<div className='flex items-center justify-start w-full mb-4'>
			<BackButton
				href='/home'
				text='Volver'
				iconSrc='/backIcon.svg'
			/>
			</div>
			<h1>Opciones de usuario</h1>
			<div className={styles.linkContainer}>
				<Link
					href='/'
					className={`${styles.link} bg-blue-600 px-4 py-2 text-slate-100`}
				>
					Iniciar Sesión
				</Link>
				<Link
					href='/user/security-questions'
					className={`${styles.link} bg-green-600 px-4 py-2 text-slate-100`}
				>
					Preguntas de seguridad
				</Link>
				<Link
					href='/reset-password'
					className={`${styles.link} bg-purple-600 px-4 py-2 text-slate-100`}
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
