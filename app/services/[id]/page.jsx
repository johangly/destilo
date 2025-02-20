'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';
import Link from 'next/link';
import { HomeIcon } from '@/components/Icons';

async function obtenerProductos() {
	try {
		const response = await fetch('/api/getServices');
		if (!response.ok) throw new Error('Error al obtener los servicios');
		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Error al obtener los servicios:', error);
		return [];
	}
}

async function editarProducto(id, producto) {
	try {
		const response = await fetch('/api/services/editService', {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ id, ...producto }),
		});

		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(`Error del servidor: ${errorText}`);
		}

		const data = await response.json();
		console.log('Servicio actualizado con éxito:', data);
		return data;
	} catch (error) {
		console.error('Error al actualizar servicio:', error);
		throw error;
	}
}

function EditProduct({ params }) {
	const { id } = params;

	const [productos, setProductos] = useState([]);
	const [producto, setProducto] = useState({
		servicio: '',
		descripcion: '',
		precio: '',
	});

	useEffect(() => {
		obtenerProductos().then((data) => {
			setProductos(data);
			const productoEncontrado = data.find((p) => p.id === id);
			if (productoEncontrado) {
				setProducto(productoEncontrado);
			}
		});
	}, [id]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setProducto((prevProducto) => ({
			...prevProducto,
			[name]: value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (Object.values(producto).some((value) => !value)) {
			alert('Por favor, completa todos los campos.');
			return;
		}

		try {
			await editarProducto(id, producto);
			alert('Servicio actualizado exitosamente');
		} catch (error) {
			alert('Error al actualizar el Servicio');
		}
	};

	return (
		<div className={styles.container}>
			<Link
				href='/home'
				className={styles.homeLink}
			>
				<HomeIcon /> Ir a inicio
			</Link>
			<h1>Editar Servicio</h1>
			<form onSubmit={handleSubmit}>
				{['servicio', 'descripcion', 'precio'].map((field) => (
					<div key={field}>
						<label htmlFor={field}>{field}</label>
						<input
							type='text'
							id={field}
							name={field}
							value={producto[field]}
							onChange={handleChange}
						/>
					</div>
				))}
				<button type='submit'>Actualizar Servicio</button>
			</form>
			<Link
				href='/services'
				className={styles.inventoryLink}
			>
				Volver a la lista de inventario
			</Link>
		</div>
	);
}

export default EditProduct;
