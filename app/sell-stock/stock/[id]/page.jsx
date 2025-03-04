'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';
import Link from 'next/link';
import { HomeIcon } from '@/components/Icons';
import React from 'react';
import { useAuth } from '@/context/AuthContext';

async function obtenerProductos(user) {

	try {
		if (!user || !user.role) {
			throw new Error('No hay sesión activa');
		}
		const response = await fetch('/api/getStocksData', {
			method: 'GET',
			headers: {
				'X-User-Role': user.role ? user.role.toString() : '',
				'Content-Type': 'application/json'
			}
		});
		if (!response.ok) throw new Error('Error al obtener los productos');
		const data = await response.json();
		return data.datos;
	} catch (error) {
		console.error('Error al obtener los productos:', error);
		return [];
	}
}

async function editarProducto(id, producto, user) {
	try {
		if (!user || !user.role) {
			throw new Error('No hay sesión activa');
		}	

		const response = await fetch('/api/editData', {
			method: 'PUT',
			headers: {
				'X-User-Role': user.role ? user.role.toString() : '',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ id, ...producto }),

		});

		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(`Error del servidor: ${errorText}`);
		}

		const data = await response.json();
		console.log('Producto actualizado con éxito:', data);
		return data;
	} catch (error) {
		console.error('Error al actualizar producto:', error);
		throw error;
	}
}

function EditProduct({ params }) {
	const { id } = React.use(params);
	const { user,loading } = useAuth();

	const [productos, setProductos] = useState([]);
	const [producto, setProducto] = useState({
		producto: '',
		cantidad: '',
		precioUnitario: '',
		codigo: '',
		proveedor: '',
	});

	useEffect(() => {
		if(user){
			obtenerProductos(user).then((data) => {
				console.log('data',data)
				console.log('id',id)
				setProductos(data);
				const productoEncontrado = data.find((p) => p.id.toString() === id.toString());
				if (productoEncontrado) {
					console.log('productoEncontrado',productoEncontrado,id)
					setProducto(productoEncontrado);
				}
			});
		}
	}, [user,id]);

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
			await editarProducto(id, producto, user);
			alert('Producto actualizado exitosamente');
		} catch (error) {
			alert('Error al actualizar el producto');
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
			<h1>Editar Producto</h1>
			<form onSubmit={handleSubmit}>
				{['producto', 'cantidad', 'precioUnitario', 'codigo', 'proveedor'].map(
					(field) => (
						<div
							className={styles.formGroup}
							key={field}
						>
							<label htmlFor={field}>
								{field.charAt(0).toUpperCase() + field.slice(1)}:
							</label>
							<input
								type={
									field === 'cantidad' || field === 'precioUnitario'
										? 'number'
										: 'text'
								}
								name={field}
								value={producto[field]}
								onChange={handleChange}
								required
							/>
						</div>
					)
				)}
				<button type='submit'>Actualizar Producto</button>
			</form>
			<Link
				href='/sell-stock/stock'
				className={styles.inventoryLink}
			>
				Volver a la lista de inventario
			</Link>
		</div>
	);
}

export default EditProduct;
