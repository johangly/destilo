'use client';

import { useState } from 'react';
import styles from './page.module.css';
import React from 'react';
import { useRouter } from 'next/navigation';

export default function ResetPassword({ params }) {
	const { token } = React.use(params);
	const router = useRouter();
	const [newPassword, setNewPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [message, setMessage] = useState('');

	const handlePasswordReset = async (e) => {
		e.preventDefault();
		setMessage('');

		if (newPassword !== confirmPassword) {
			setMessage('Las contraseñas no coinciden');
			return;
		}

		try {
			const response = await fetch('/api/resetPassword', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ token, newPassword }),
			});
			const data = await response.json();

			if (!response.ok) throw new Error(data.error);

			setMessage('Contraseña restablecida con éxito, redirigiendo al login...');
			setTimeout(() => {
				router.push('/');
			}, 3000);
		} catch (error) {
			setMessage('Error al restablecer la contraseña');
		}
	};

	return (
		<div className={styles.container}>
			<div style={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',gap:'1rem',backgroundColor:'#fbfbfb',borderRadius:'8px',padding:'20px',maxWidth:'400px',width:'100%'}}>
				<div style={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',gap:'.5rem',width:'100%'}}>
					<h2 style={{fontSize:'1.4rem',fontWeight:'bold',color:'#333'}}>Restablecer Contraseña</h2>
					<span style={{color:'#555',fontSize:'0.875rem',textAlign:'center'}}>Por favor, complete el siguiente formulario para restablecer su contraseña.</span>
				</div>
				{message && 
					<p className={message.toLowerCase().includes('error') ? styles.error : styles.success}>
						{message}
					</p>
				}
				<form onSubmit={handlePasswordReset} style={{display:'flex',flexDirection:'column',gap:'1rem',width:'100%'}}>
					<div>
						<label>Nueva Contraseña:</label>
						<input
							type='password'
							value={newPassword}
							onChange={(e) => setNewPassword(e.target.value)}
							required
							minLength={6}
						/>
					</div>
					<div>
						<label>Confirmar Contraseña:</label>
						<input
							type='password'
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							required
							minLength={6}
						/>
					</div>
					<button type='submit'>Cambiar Contraseña</button>
				</form>
			</div>
		</div>
	);
}
