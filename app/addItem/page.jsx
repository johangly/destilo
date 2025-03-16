'use client';

import { useState,useEffect } from 'react';
import styles from './page.module.css';
import Link from 'next/link';
import { HomeIcon } from '@/components/Icons';
import { useAuth } from '@/context/AuthContext';

async function agregarVenta(venta,user) {
	try {
		if (!user || !user.role) {
			throw new Error('No hay sesión activa');
		}
		
		const response = await fetch('/api/addData', {
			method: 'POST',
			headers: {
				'X-User-Role': user.role ? user.role.toString() : '',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(venta),
		});

		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(`Error del servidor: ${errorText}`);
		}

		const data = await response.json();
	} catch (error) {
		console.error('Error al agregar venta:', error);
	}
}

function AddVentaComponent() {
	const [suppliers,setSuppliers] = useState([])
	const [selectedSupplier,setSelectedSupplier] = useState({
		id:0,
	})

	const [venta, setVenta] = useState({
		producto: '',
		cantidad: '',
		precioUnitario: '',
		codigo: '',
		proveedor_id: selectedSupplier.id,
	});
	const { user,loading } = useAuth();
	const handleChange = (e) => {
		const { id, value } = e.target;
		setVenta((prevVenta) => ({
			...prevVenta,
			[id]: value, // Actualiza el campo correspondiente
		}));
	};

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
		} catch (error) {
			console.error(error.message);
			alert('Error al obtener los proveedores.');
		}
	};

	const handleAddVenta = async () => {
		if (!venta.producto || !venta.cantidad || !venta.precioUnitario) {
			alert('Por favor, completa todos los campos.');
			return;
		}

		if (!venta.proveedor_id) {
			alert('Por favor, selecciona un proveedor.');
			return;
		}
		
		await agregarVenta(venta,user); // Llama a la función para agregar la venta
		alert('Venta agregada con éxito');
		setSelectedSupplier({ id: 0 });
		setVenta({
			producto: '',
			cantidad: '',
			precioUnitario: '',
			codigo: '',
			proveedor_id: 0
		}); // Limpia los campos
	};

	const handleSupplierChange = (e) => {
		const { value } = e.target;
		setVenta(prevVenta => ({
			...prevVenta,
			proveedor_id: value
		}));
		setSelectedSupplier({ id: value });
	};

	useEffect(()=>{
		if(user){
			getSuppliers();
		}
	},[user])
	return (
		<div
			style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}
		>
			<div className={styles.container}>
				<Link href='/home'>
					<HomeIcon />
				</Link>
				<h1>Agregar nuevo producto</h1>
				<div className={styles.formGroup}>
					<label htmlFor='producto'>Producto:</label>
					<input
						type='text'
						id='producto'
						value={venta.producto}
						onChange={handleChange}
					/>
				</div>
				<div className={styles.formGroup}>
					<label htmlFor='cantidad'>Cantidad:</label>
					<input
						type='number'
						id='cantidad'
						value={venta.cantidad}
						onChange={handleChange}
					/>
				</div>
				<div className={styles.formGroup}>
					<label htmlFor='precioUnitario'>Precio Unitario:</label>
					<input
						type='text'
						id='precioUnitario'
						value={venta.precioUnitario}
						onChange={handleChange}
					/>
				</div>
				<div className={styles.formGroup}>
					<label htmlFor='codigo'>Código:</label>
					<input
						type='text'
						id='codigo'
						value={venta.codigo}
						onChange={handleChange}
					/>
				</div>
				<div className={styles.formGroup}>
					<label htmlFor='selectedCustomer'>Seleccionar cliente:</label>
					<select
					value={selectedSupplier.id}
					onChange={handleSupplierChange}
					id='selectedCustomer'
					style={{
						width: '100%',
					}}>
						<option value="">Selecciona un cliente</option>
						{suppliers.map((supplier) => (
							<option key={supplier.id} value={supplier.id}>
								{supplier.nombre}
							</option>
						))}
					</select>
					{/* <label htmlFor='proveedor'>Proveedor:</label>
					<input
						type='text'
						id='proveedor'
						value={venta.proveedor}
						onChange={handleChange}
					/> */}
				</div>
				
				<button onClick={handleAddVenta}>Agregar Producto</button>
				<Link href='/sell-stock/stock'>
					<button
						style={{
							backgroundColor: '#2196F3',
							color: 'white',
						}}
					>
						Volver
					</button>
				</Link>
			</div>
		</div>
	);
}

export default AddVentaComponent;
