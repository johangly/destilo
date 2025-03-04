'use client';
import { useState, useEffect } from 'react';
import styles from './page.module.css';
import Link from 'next/link';
import { HomeIcon } from '@/components/Icons';
import { useAuth } from '@/context/AuthContext';

function Page() {
	const [services, setServices] = useState([]);
	const [newService, setNewService] = useState({
		servicio: '',
		descripcion: '',
		precio: '',
	});
	const [showForm, setShowForm] = useState(false); // Estado para mostrar/ocultar formulario
	const { user,loading } = useAuth();

	// Obtener servicios desde la API
	const obtenerServicios = async () => {
		try {

			if (!user || !user.role) {
				throw new Error('No hay sesión activa');
			}

			const response = await fetch('/api/getServices', {
				method: 'GET',
				headers: {
					'X-User-Role': user.role ? user.role.toString() : '',
					'Content-Type': 'application/json'
    			}
			});

			if (!response.ok) throw new Error('Error al obtener los servicios');
			const { data } = await response.json();
			setServices(data);
		} catch (error) {
			console.error(error.message);
		}
	};

	useEffect(() => {
		if(user){
			obtenerServicios();
		}
	}, [user]);

	// Manejar cambios en los inputs
	const handleChange = (e) => {
		const { name, value } = e.target;
		setNewService((prev) => ({ ...prev, [name]: value }));
	};

	// Agregar nuevo servicio
	const agregarServicio = async () => {
		try {

			if (!user || !user.role) {
				throw new Error('No hay sesión activa');
			}

			const response = await fetch('/api/services/addService', {
				method: 'POST',
				headers: {
					'X-User-Role': user.role ? user.role.toString() : '',
					'Content-Type': 'application/json'
    			},
				body: JSON.stringify(newService),

			});

			if (!response.ok) throw new Error('Error al agregar el servicio');

			alert('✅ Servicio agregado con éxito');

			setNewService({ servicio: '', descripcion: '', precio: '' });
			setShowForm(false); // Ocultar formulario después de agregar
			obtenerServicios();
		} catch (error) {
			console.error(error.message);
		}
	};

	// Eliminar servicio
	const eliminarServicio = async (id) => {
		if (!confirm('⚠️ ¿Está seguro de eliminar este servicio?')) return;

		if (!user || !user.role) {
			throw new Error('No hay sesión activa');
		}
		
		try {
			const response = await fetch('/api/services/deleteService', {
				method: 'DELETE',
				headers: { 
					'Content-Type': 'application/json',
					'X-User-Role': user.role ? user.role.toString() : ''
				 },
				body: JSON.stringify({ id }),
			});
			if (!response.ok) throw new Error('Error al eliminar el servicio');

			obtenerServicios();
		} catch (error) {
			console.error(error.message);
		}
	};

	return (
		<div className={styles.serviceContainer}>
			<Link
				href='/home'
				className={styles.homeLink}
			>
				<HomeIcon /> <p>Ir a inicio</p>
			</Link>

			<h1 className={styles.title}>Gestión de Servicios</h1>

			{/* Botón para mostrar/ocultar el formulario */}
			<button
				onClick={() => setShowForm(!showForm)}
				className={styles.toggleButton}
			>
				{showForm ? 'Ocultar Formulario' : 'Agregar Servicio'}
			</button>

			{/* Formulario para agregar servicio */}
			<div className={`${styles.formContainer} ${showForm ? styles.show : ''}`}>
				<input
					type='text'
					name='servicio'
					placeholder='Nombre del servicio'
					value={newService.servicio}
					onChange={handleChange}
					required
					className={styles.input}
				/>
				<input
					type='text'
					name='descripcion'
					placeholder='Descripción'
					value={newService.descripcion}
					onChange={handleChange}
					required
					className={styles.input}
				/>
				<input
					type='number'
					name='precio'
					placeholder='Precio (USD)'
					value={newService.precio}
					onChange={handleChange}
					required
					className={styles.input}
				/>
				<button
					onClick={() => { agregarServicio() }}
					className={styles.addButton}
				>
					Agregar Servicio
				</button>
			</div>

			{/* Tabla de servicios */}
			<table className={styles.table}>
				<thead>
					<tr>
						<th>Servicio</th>
						<th>Descripción</th>
						<th>Precio</th>
						<th>Acciones</th>
					</tr>
				</thead>
				<tbody>
					{services.map((service) => (
						<tr key={service.id}>
							<td>{service.servicio}</td>
							<td>{service.descripcion}</td>
							<td>${parseFloat(service.precio).toFixed(2)}</td>
							<td className={styles.actionButtons}>
								<Link
									href={`/services/${service.id}`}
									className={styles.editButton}
								>
									Editar
								</Link>
								<button
									onClick={() => eliminarServicio(service.id)}
									className={styles.deleteButton}
								>
									Eliminar
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

export default Page;
