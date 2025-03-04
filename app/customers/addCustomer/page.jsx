'use client';

import React, { useState } from 'react';
import styles from './page.module.css';
import Link from 'next/link';
import { HomeIcon } from '@/components/Icons';
import { useAuth } from '@/context/AuthContext';

function AddCustomerForm() {
	const [formData, setFormData] = useState({
		cliente: '',
		cedula: '',
		teléfono: '',
		email: '',
		direccion: '',
		nrocasa: '',
		ciudad: '',
		provincia: '',
		pais: '',
		empresa: '',
		rif: '',
	});

	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState(null);
	const [empresa, setEmpresa] = useState(false);


	const { user } = useAuth();
	const handleChange = (e) => {
		const { id, value } = e.target;
		let newValue = value;

		// Restringir el campo "cliente" a solo letras y espacios
		if (id === 'cliente') {
			newValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
		}

		setFormData((prevData) => ({
			...prevData,
			[id]: newValue, // Asignamos el valor filtrado
		}));
	};

	const handleChangeTelefono = (e) => {
		let value = e.target.value.replace(/\D/g, ''); // Elimina caracteres no numéricos

		// Aplica el formato (0XXX)XXXXXXX
		if (value.length >= 4) {
			value = `(${value.slice(0, 4)})${value.slice(4, 11)}`;
		}

		// Limita la cantidad de caracteres a 13
		if (value.length > 13) {
			value = value.slice(0, 13);
		}

		setFormData({ ...formData, teléfono: value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setMessage(null);

		// Asegúrate de que todos los campos se envíen correctamente
		const dataToSend = {
			...formData,
			empresa: empresa ? formData.empresa : 'Sin empresa', // Asignar valor por defecto a empresa
			nrocasa: formData.nrocasa || '', // Asegura que los campos opcionales no sean undefined
			ciudad: formData.ciudad || '',
			provincia: formData.provincia || '',
			pais: formData.pais || '',
		};

		try {

			if (!user || !user.role) {
				throw new Error('No hay sesión activa');
			}

			const response = await fetch('/api/addCustomer', {
				method: 'POST',
				headers: {
					'X-User-Role': user.role ? user.role.toString() : '',
					'Content-Type': 'application/json'
    			},
				body: JSON.stringify(dataToSend), // Enviar todos los campos
			});

			if (!response.ok) {
				throw new Error('Error al agregar el cliente.');
			}

			const data = await response.json();
			setMessage(`Cliente agregado con éxito: ID ${data.id}`);
			setFormData({
				cliente: '',
				cedula: '',
				teléfono: '',
				email: '',
				direccion: '',
				nrocasa: '',
				ciudad: '',
				provincia: '',
				pais: '',
				empresa: '',
				rif: '',
			});
			setEmpresa(false); // Reiniciar el checkbox
		} catch (error) {
			setMessage('Error al agregar el cliente. Intenta nuevamente.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className={styles.formContainer}>
			<Link
				href='/home'
				style={{
					textDecoration: 'none',
					display: 'flex',
					alignItems: 'center',
					marginBottom: '30px',
				}}
			>
				<HomeIcon /> <p style={{ marginLeft: '10px' }}>Ir a inicio</p>
			</Link>
			<h2 className={styles.title}>Agregar Nuevo Cliente</h2>
			{message && <p className={styles.message}>{message}</p>}
			<form
				onSubmit={handleSubmit}
				className={styles.form}
			>
				<div className={styles.formGroup}>
					<label htmlFor='cliente'>Nombre del Cliente:</label>
					<input
						type='text'
						id='cliente'
						value={formData.cliente}
						onChange={handleChange}
						required
					/>
				</div>
				<div className={styles.formGroup}>
					<label htmlFor='cedula'>Cédula:</label>
					<input
						type='number'
						id='cedula'
						value={formData.cedula}
						onChange={(e) => {
							const value = e.target.value;
							if (
								value === '' ||
								(Number(value) <= 99999999 && Number(value) >= 0)
							) {
								handleChange(e);
							}
						}}
						max={99999999}
						required
					/>
				</div>
				<div className={styles.formGroup}>
					<label htmlFor='teléfono'>Teléfono:</label>
					<input
						type='text'
						id='teléfono'
						value={formData.teléfono}
						onChange={handleChangeTelefono}
						required
						placeholder='(0424)1234567'
					/>
				</div>
				<div className={styles.formGroup}>
					<label htmlFor='email'>Email:</label>
					<input
						type='email'
						id='email'
						value={formData.email}
						onChange={handleChange}
						required
					/>
				</div>
				<div className={styles.formGroup}>
					<label htmlFor='direccion'>Dirección:</label>
					<input
						type='text'
						id='direccion'
						value={formData.direccion}
						onChange={handleChange}
						required
						placeholder='Calle, Avenida, Carretera...'
					/>
				</div>
				<div className={styles.formGroup}>
					<label htmlFor='nrocasa'>Número:</label>
					<input
						type='text'
						id='nrocasa'
						value={formData.nrocasa}
						onChange={handleChange}
						placeholder='Casa, Apartamento, Local...'
					/>
				</div>
				<div className={styles.formGroup}>
					<label htmlFor='ciudad'>Ciudad:</label>
					<input
						type='text'
						id='ciudad'
						value={formData.ciudad}
						onChange={handleChange}
						placeholder='Ciudad...'
					/>
				</div>
				<div className={styles.formGroup}>
					<label htmlFor='provincia'>Provincia:</label>
					<input
						type='text'
						id='provincia'
						value={formData.provincia}
						onChange={handleChange}
						placeholder='Provincia...'
					/>
				</div>
				<div className={styles.formGroup}>
					<label htmlFor='pais'>País:</label>
					<input
						type='text'
						id='pais'
						value={formData.pais}
						onChange={handleChange}
						placeholder='País...'
					/>
				</div>
				<div className={styles.checkBox}>
					<input
						type='checkbox'
						id='empresa'
						checked={empresa}
						onChange={() => setEmpresa(!empresa)}
					/>
					<label htmlFor='empresa'>
						¿Tiene empresa?
						<span className={styles.switch}></span>
					</label>
				</div>

				{empresa && (
					<div className={styles.formGroup}>
						<label htmlFor='empresa'>Empresa:</label>
						<input
							type='text'
							id='empresa'
							value={formData.empresa}
							onChange={handleChange}
							required
						/>
						<label htmlFor='rif'>RIF:</label>
						<input
							type='text'
							id='rif'
							value={formData.rif}
							onChange={handleChange}
							placeholder='J-12345678'
						/>
					</div>
				)}
				<button
					type='submit'
					className={styles.submitButton}
					disabled={loading}
				>
					{loading ? 'Agregando...' : 'Agregar Cliente'}
				</button>
			</form>
			<Link
				href='/customers'
				style={{
					marginTop: '1rem',
					display: 'block',
					textAlign: 'center',
					color: '#1a73e8',
				}}
			>
				Regresar a la lista de clientes
			</Link>
		</div>
	);
}

export default AddCustomerForm;
