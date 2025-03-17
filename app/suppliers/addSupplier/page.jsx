'use client';

import React, { useState } from 'react';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import BackButton from '@/components/BackButton';

function FormularioProveedor() {
	const [formData, setFormData] = useState({
		nombre: '',
		razonSocial: '',
		rif: '',
		telefono: '',
		email: '',
		direccion: {
			calle: '',
			numero: '',
			ciudad: '',
			estado: '',
			pais: '',
		},
		productos: '',
		servicios: '',
		cargo: '',
		webrrss: '',
	});


	const { user,loading } = useAuth();
	const router = useRouter();

	const handleChange = (e) => {
		const { name, value } = e.target;

		let newValue = value;

		// Si el input es "nombre", restringimos a solo letras y espacios
		if (name === 'nombre') {
			newValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
		}

		// Si el campo pertenece a la dirección, actualizarlo dentro del objeto direccion
		if (name.startsWith('direccion.')) {
			const field = name.split('.')[1]; // Extraer la clave del objeto direccion
			setFormData((prevState) => ({
				...prevState,
				direccion: { ...prevState.direccion, [field]: newValue },
			}));
		} else {
			setFormData((prevData) => ({
				...prevData,
				[name]: newValue, // Asignamos el valor filtrado
			}));
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await fetch('/api/addSupplier', {
				method: 'POST',
				headers: {
					'X-User-Role': user.role ? user.role.toString() : '',
					'Content-Type': 'application/json'
    			},
				body: JSON.stringify(formData),
			});

			if (!response.ok) {
				throw new Error('Error al agregar el proveedor');
			}

			router.push('/suppliers');
		} catch (error) {
			console.error(error.message);
		}
	};

	const formatPhoneNumber = (input) => {
		// Eliminar caracteres no numéricos
		const cleaned = input.replace(/\D/g, '');

		// Aplicar formato (0XXX)XXXXXXX
		if (cleaned.length >= 4) {
			return `(${cleaned.slice(0, 4)})${cleaned.slice(4, 11)}`;
		}
		return cleaned; // Retorna sin formato si aún no hay suficientes dígitos
	};

	return (
		<div className={styles.formContainer}>
			<BackButton
					href='/suppliers'
					text='Volver'
					iconSrc='/backIcon.svg'
				/>
			<h1 className={styles.title}>Agregar Proveedor</h1>
			<form onSubmit={handleSubmit}>
				<h3>Proveedor:</h3>
				<input
					type='text'
					name='nombre'
					placeholder='Nombre del proveedor'
					value={formData.nombre}
					onChange={handleChange}
					required
				/>
				<input
					type='text'
					name='razonSocial'
					placeholder='Razón Social'
					value={formData.razonSocial}
					onChange={handleChange}
					required
				/>
				<input
					type='text'
					name='rif'
					placeholder='RIF'
					value={formData.rif}
					onChange={handleChange}
					required
				/>
				<input
					type='tel'
					name='telefono'
					placeholder='(0424)1234567'
					value={formData.telefono}
					onChange={(e) => {
						const formattedPhone = formatPhoneNumber(e.target.value);
						setFormData({ ...formData, telefono: formattedPhone });
					}}
					pattern='\(\d{4}\)\d{7}'
					title='El formato debe ser (0XXX)XXXXXXX'
					required
				/>

				<input
					type='email'
					name='email'
					placeholder='Email'
					value={formData.email}
					onChange={handleChange}
					required
				/>

				{/* Dirección desglosada */}
				<h3>Dirección</h3>
				<input
					type='text'
					name='direccion.calle'
					placeholder='Calle/Av/Carretera'
					value={formData.direccion.calle}
					onChange={handleChange}
					required
				/>
				<input
					type='text'
					name='direccion.numero'
					placeholder='Número de edificio/apto/etc'
					value={formData.direccion.numero}
					onChange={handleChange}
					required
				/>
				<input
					type='text'
					name='direccion.ciudad'
					placeholder='Ciudad'
					value={formData.direccion.ciudad}
					onChange={handleChange}
					required
				/>
				<input
					type='text'
					name='direccion.estado'
					placeholder='Estado/Provincia'
					value={formData.direccion.estado}
					onChange={handleChange}
					required
				/>
				<input
					type='text'
					name='direccion.pais'
					placeholder='País'
					value={formData.direccion.pais}
					onChange={handleChange}
					required
				/>

				<h3>Otros</h3>

				<input
					type='text'
					name='productos'
					placeholder='Productos'
					value={formData.productos}
					onChange={handleChange}
					required
				/>
				<input
					type='text'
					name='servicios'
					placeholder='Servicios'
					value={formData.servicios}
					onChange={handleChange}
					required
				/>
				<input
					type='text'
					name='cargo'
					placeholder='Cargo'
					value={formData.cargo}
					onChange={handleChange}
					required
				/>
				<input
					type='text'
					name='webrrss'
					placeholder='Web/RRSS'
					value={formData.webrrss}
					onChange={handleChange}
					required
				/>

				<button
					type='submit'
					className={styles.submitButton}
				>
					Agregar
				</button>
			</form>
			<Link
				href='/suppliers'
				style={{
					marginTop: '1rem',
					display: 'block',
					textAlign: 'center',
					color: '#1a73e8',
				}}
			>
				Volver
			</Link>
		</div>
	);
}

export default FormularioProveedor;
