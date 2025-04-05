'use client';

import React, { useState } from 'react';
import styles from './page.module.css';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import BackButton from '@/components/BackButton';

function AddCustomerForm() {
	const [formData, setFormData] = useState({
		username: '',
		email: '',
		password: '',
		role: '',
	});

	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState(null);

	const { user } = useAuth();

	const handleChange = (e) => {
		const { id, value } = e.target;
		let newValue = value;

		if (id === 'role') {
			setFormData((prevData) => ({
				...prevData,
				role: value
			}));
			return;
		}

		setFormData((prevData) => ({
			...prevData,
			[id]: newValue, // Asignamos el valor filtrado
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setMessage(null);

		// Validaciones de campos vacíos
		if (!formData.username || !formData.email || !formData.password || !formData.role) {
			setMessage('Por favor, complete todos los campos.');
			setLoading(false);
			return;
		}

		// Validación de longitud del nombre de usuario
		if (formData.username.length < 3) {
			setMessage('El nombre de usuario debe tener al menos 3 caracteres.');
			setLoading(false);
			return;
		}

		// Validación de contraseña
		const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[0-9a-zA-Z]).{8,16}$/;
		if (!passwordRegex.test(formData.password)) {
			setMessage('La contraseña debe tener entre 8 y 16 caracteres, incluir al menos una letra mayúscula y un carácter especial.');
			setLoading(false);
			return;
		}

		// Validación del correo electrónico
		const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailPattern.test(formData.email)) {
			setMessage('Por favor, ingrese un correo electrónico válido.');
			setLoading(false);
			return;
		}

		// Validación del rol
		if (!['admin', 'employee'].includes(formData.role)) {
			setMessage('Por favor, seleccione un rol válido.');
			setLoading(false);
			return;
		}

		const dataToSend = {
			username: formData.username.trim(),
			email: formData.email.trim(),
			password: formData.password,
			role: formData.role,
		};

		try {

			if (!user || !user.role) {
				throw new Error('No hay sesión activa');
			}

			const response = await fetch('/api/addUser', {
				method: 'POST',
				headers: {
					'X-User-Role': user.role ? user.role.toString() : '',
					'Content-Type': 'application/json'
    			},
				body: JSON.stringify(dataToSend), // Enviar todos los campos
			});

			if (!response.ok) {
				throw new Error('Error al agregar el usuario.');
			}

			const data = await response.json();
			setMessage(data.message);
			setFormData({
				username: '',
				email: '',
				password: '',
				role: '',
			});
		} catch (error) {
			setMessage('Error al agregar el usuario. Intenta nuevamente.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className={`${styles.formContainer} bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 border-1 border-slate-300 dark:border-slate-500`}>
			<BackButton
				href='/users'
				text='Volver'
				iconSrc='/backIcon.svg'
			/>
			<h2 className={styles.title}>Agregar Nuevo Usuario</h2>
			{message && <p className={styles.message}>{message}</p>}
			<form
				onSubmit={handleSubmit}
				className={styles.form}
			>
				<div className={styles.formGroup}>
					<label htmlFor='username'>Nombre del Usuario:</label>
					<input
						type='text'
						id='username'
						value={formData.username}
						onChange={handleChange}
						required
					/>
				</div>
				<div className={styles.formGroup}>
					<label htmlFor='email'>Correo Electrónico:</label>
					<input
						type='email'
						id='email'
						value={formData.email}
						onChange={handleChange}
						required
					/>
				</div>
				<div className={styles.formGroup}>
					<label htmlFor='password'>Contraseña:</label>
					<input
						type='password'
						id='password'
						value={formData.password}
						onChange={handleChange}
						required
					/>
				</div>
				<div className={styles.formGroup}>
					<label htmlFor='role'>Rol:</label>
					<select
						id='role'
						value={formData.role}
						onChange={handleChange}
						required
					>
						<option className={`bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100`} value="">Seleccione un rol</option>
						<option className={`bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100`} value="admin">Administrador</option>
						<option className={`bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100`} value="employee">Empleado</option>
					</select>
				</div>
				<button
					type='submit'
					className={styles.submitButton}
					disabled={loading}
				>
					{loading ? 'Creando...' : 'Creando Usuario'}
				</button>
			</form>
			<Link
				href='/users'
				style={{
					marginTop: '1rem',
					display: 'block',
					textAlign: 'center',
					color: '#1a73e8',
				}}
			>
				Regresar a la lista de usuarios
			</Link>
		</div>
	);
}

export default AddCustomerForm;
