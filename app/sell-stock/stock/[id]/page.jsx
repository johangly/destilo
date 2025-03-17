'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';
import Link from 'next/link';
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import BackButton from '@/components/BackButton';
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

		if(!producto.proveedor_id){
			throw new Error('Por favor, selecciona un proveedor.');
		}

		const {proveedor, ...productoSinProveedor} = producto;
		
		const response = await fetch('/api/editData', {
			method: 'PUT',
			headers: {
				'X-User-Role': user.role ? user.role.toString() : '',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ id, ...productoSinProveedor }),
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

	const [suppliers,setSuppliers] = useState([])
	const [selectedSupplier, setSelectedSupplier] = useState(null);

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
			return(data)
		} catch (error) {
			console.error(error.message);
			alert('Error al obtener los proveedores.');
		}
	};

	const [productos, setProductos] = useState([]);
	const [producto, setProducto] = useState({
		producto: '',
		cantidad: '',
		precioUnitario: '',
		codigo: '',
		proveedor_id: '',
	});

	useEffect(() => {
		if(user){
			obtenerProductos(user).then((data) => {
				setProductos(data);
				const productoEncontrado = data.find((p) => p.id.toString() === id.toString());
				if (productoEncontrado) {
					setProducto(productoEncontrado);
					setSelectedSupplier(productoEncontrado.proveedor_id);
					getSuppliers();
				}
			});
		}
	}, [user, id]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setProducto((prevProducto) => ({
			...prevProducto,
			[name]: value,
		}));
	};

	const handleSupplierChange = (e) => {
		const value = e.target.value;
		setSelectedSupplier(value);
		setProducto(prev => ({
			...prev,
			proveedor_id: value
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (Object.values(producto).some((value) => !value)) {
			alert('Por favor, completa todos los campos.');
			return;
		}

		if (!producto.proveedor_id) {
			alert('Por favor, selecciona un proveedor.');
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
			<BackButton
				href='/sell-stock/stock'
				text='Volver'
				iconSrc='/backIcon.svg'
			/>
			<h1>Editar Producto</h1>
			<form onSubmit={handleSubmit}>
				{['producto', 'cantidad', 'precioUnitario', 'codigo'].map(
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
				<div>
					<label htmlFor='selectedCustomer'>Seleccionar cliente:</label>
					<select
						value={selectedSupplier || ''}
						onChange={handleSupplierChange}
						id='selectedCustomer'
						style={{
							width: '100%',
							maxWidth: '313px',
							border: '1px solid #ccc',
							borderRadius: '4px',
							padding: '8px',
							boxSizing: 'border-box',
						}}>
						<option value="">Selecciona un cliente</option>
						{suppliers.map((supplier) => (
							<option
								key={supplier.id}
								value={supplier.id}
							>
								{supplier.nombre}
							</option>
						))}
					</select>
				</div>
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
