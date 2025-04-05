'use client';

import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import Link from 'next/link';
import { DeleteIcon } from '@/components/Icons';
import { useAuth } from '@/context/AuthContext';
import BackButton from '@/components/BackButton';

function ListaProveedores() {
	const [suppliers, setSuppliers] = useState([]); // Estado para los proveedores filtrados
	const [allSuppliers, setAllSuppliers] = useState([]); // Estado para todos los proveedores
	const [message, setMessage] = useState(null);
	const { user,loading } = useAuth();
	// Función para obtener proveedores desde Firebase
	const getSuppliers = async () => {
		try {

			if (!user || !user.role) {
				throw new Error('No hay sesión activa');
			}

			const response = await fetch('/api/getSuppliers', {
				method: 'GET',
				headers: {
					'X-User-Role': user.role ? user.role.toString() : '',
					'Content-Type': 'application/json'
    			}
			});
			if (!response.ok) throw new Error('Error al obtener los proveedores');
			const { data } = await response.json();
			setSuppliers(data); // Actualiza el estado con los datos filtrados
			setAllSuppliers(data); // Almacena todos los proveedores en un estado separado
		} catch (error) {
			console.error(error.message);
			alert('Error al obtener los proveedores.');
		}
	};

	// Función para eliminar un proveedor
	const deleteSupplier = async (id) => {
		// Mostrar alerta de confirmación
		const confirmDelete = window.confirm(
			'¿Estás seguro de que deseas eliminar este proveedor?'
		);

		if (!confirmDelete) return; // Si el usuario cancela, no se ejecuta la eliminación

		if (!user || !user.role) {
			throw new Error('No hay sesión activa');
		}
		
		try {
			const response = await fetch('/api/deleteSupplier', {
				method: 'DELETE',
				headers: { 
					'Content-Type': 'application/json',
					'X-User-Role': user.role ? user.role.toString() : '',
				},
				body: JSON.stringify({ id }),
			});

			if (!response.ok) {
				throw new Error('Error al eliminar el proveedor');
			}

			// Actualizar la lista de proveedores
			setSuppliers((prev) => prev.filter((supplier) => supplier.id !== id));
			alert('Proveedor eliminado con éxito.');
		} catch (error) {
			console.error(error.message);
			alert('Error al eliminar el proveedor.');
		}
	};

	// Filtrar proveedores según la búsqueda
	const handleSearch = (e) => {
		const searchValue = e.target.value.trim().toLowerCase(); // Convertir a minúsculas

		if (searchValue === '') {
			setSuppliers(allSuppliers);
			return;
		}

		const filteredSuppliers = allSuppliers.filter((supplier) => {
			const razonSocial = supplier.razonSocial?.toLowerCase() || '';
			const rif = supplier.rif?.toLowerCase() || '';
			const nombre = supplier.nombre?.toLowerCase() || '';

			return (
				razonSocial.includes(searchValue) ||
				rif.includes(searchValue) ||
				nombre.includes(searchValue)
			);
		});

		setSuppliers(filteredSuppliers);
	};

	useEffect(() => {
		if(user){
			getSuppliers();
		}
	}, [user]);

	return (
		<div className={`${styles.suppliersContainer} bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 [&_input]:border-1 [&_input]:border-slate-400 [&_select]:border-1 [&_select]:border-slate-400`}>
			<BackButton
				href='/home'
				text='Volver'
				iconSrc='/backIcon.svg'
			/>
			<h1 className={`${styles.title} text-slate-800 dark:text-slate-100`}>Lista de Proveedores</h1>
			<div className={`${styles.searchContainer} text-slate-800 dark:text-slate-100`}>
				<label className={`${styles.searchLabel} text-slate-800 dark:text-slate-100`}>
					<strong>Buscar:</strong>
				</label>
				<input
					type='text'
					placeholder='Razon Social, Rif o Nombre'
					className={styles.searchInput}
					onChange={handleSearch} // Ejecuta la búsqueda al escribir
				/>
			</div>

			<Link
				href='/suppliers/addSupplier'
				style={{
					marginTop: '1rem',
					marginBottom: '1rem',
					display: 'block',
					textAlign: 'center',
				}}
				className="bg-blue-600 w-fit p-3 rounded mx-auto text-white"
			>
				Agregar Proveedor
			</Link>

			{message && <p className={styles.message}>{message}</p>}

			<div className={styles.cardsContainer}>
				{suppliers.map((supplier) => (
					<div
						key={supplier.id}
						className={`${styles.supplierCard} bg-slate-100 border-t-4 border-slate-300 dark:bg-slate-600 text-slate-800 dark:text-slate-100 `}
					>
						<h2 className={`${styles.supplierName} text-slate-800 dark:text-slate-100`}>{supplier.nombre}</h2>
						<p className={styles.detail}>
							<strong>Razón Social:</strong> {supplier.razonSocial}
						</p>
						<p className={styles.detail}>
							<strong>RIF:</strong> {supplier.rif}
						</p>
						<p className={styles.detail}>
							<strong>Teléfono:</strong> {supplier.telefono}
						</p>
						<p className={styles.detail}>
							<strong>Email:</strong>{' '}
							<a
								href={`mailto:${supplier.email}`}
								className={styles.emailLink}
							>
								{supplier.email}
							</a>
						</p>

						{/* Dirección desglosada */}
						<p className={styles.detail}>
							<strong>Dirección:</strong>
							<br />
							{supplier.direccion?.calle && (
								<span>{supplier.direccion.calle}, </span>
							)}
							{supplier.direccion?.numero && (
								<span>{supplier.direccion.numero}, </span>
							)}
							{supplier.direccion?.ciudad && (
								<span>{supplier.direccion.ciudad}, </span>
							)}
							{supplier.direccion?.estado && (
								<span>{supplier.direccion.estado}, </span>
							)}
							{supplier.direccion?.pais && (
								<span>{supplier.direccion.pais}</span>
							)}
						</p>

						<p className={styles.detail}>
							<strong>Productos:</strong> {supplier.productos}
						</p>
						<p className={styles.detail}>
							<strong>Servicios:</strong> {supplier.servicios}
						</p>
						<p className={styles.detail}>
							<strong>Cargo en la empresa:</strong> {supplier.cargo}
						</p>
						<p className={styles.detail}>
							<strong>Web/RRSS:</strong> {supplier.webrrss}
						</p>

						<button
							className={styles.deleteButton}
							onClick={() => deleteSupplier(supplier.id)}
						>
							<DeleteIcon />
						</button>
					</div>
				))}
			</div>
		</div>
	);
}

export default ListaProveedores;
