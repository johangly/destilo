'use client';

import { useState } from 'react';
import Container from '@/components/Container';

export default function ResetPassword() {
	const [email, setEmail] = useState('');
	const [message, setMessage] = useState('');

	const handlePasswordReset = async (e) => {
		e.preventDefault();
		setMessage('');

		try {
			const response = await fetch('/api/requestResetPassword', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email }),
			}); 

			const data = await response.json();
			if (!response.ok) throw new Error(data.message);

			setMessage('Correo de recuperación enviado.');
		} catch (error) {
			setMessage(error.message);
		}
	};

	return (
		<Container>
			<div className="w-full max-w-md mx-auto text-center">
				<h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-3">Recuperar Contraseña</h1>
				<form onSubmit={handlePasswordReset} className="flex flex-col space-y-4">
					<div className="flex flex-col">
						<p className="text-slate-800 dark:text-slate-100 text-lg mb-5">Ingrese su correo para recibir el email de recuperacion de contraseña</p>
						{/* <label className="text-sm text-slate-600 dark:text-slate-300 mb-1 text-left">
							Email:
						</label> */}
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							placeholder="tucorre@gmail.com"
							className="w-full p-3 text-base border border-gray-300 dark:border-gray-600 rounded-md 
							bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100
							focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>
					</div>
					<button 
						type="submit"
						className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-md
						text-base font-medium transition-colors duration-200"
					>
						Enviar Correo
					</button>
				</form>
				{message && (
					<p className={`mt-4 text-base font-semibold ${
						message.toLowerCase().includes('error') 
							? 'text-red-500 dark:text-red-400' 
							: 'text-green-500 dark:text-green-400'
					}`}>
						{message}
					</p>
				)}
			</div>
		</Container>
	);
}
