'use client';

import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import Logo from '@/components/Logo';
function ProductPage({ params }) {
	const { id } = React.use(params);

	const [product, setProduct] = useState(null);
	const [cedula, setCedula] = useState('');
	const [nombre, setNombre] = useState('');
	const [metodoPago, setMetodoPago] = useState('');
	const [fechaPago, setFechaPago] = useState('');
	const [metodoEntrega, setMetodoEntrega] = useState('');
	const { user,loading } = useAuth();
	
	// Obtener el producto específico basado en el ID
	const obtenerProducto = async () => {
		try {
			if (!user || !user.role) {
				throw new Error('No hay sesión activa');
			}
			console.log('id antes de enviarlo a la API:',id)
			const response = await fetch(`/api/getSellsDataById?id=${id}`, {
				method: 'GET',
				headers: {
					'X-User-Role': user.role ? user.role.toString() : '',
					'Content-Type': 'application/json'
				}
			});
			if (!response.ok) {
					console.error(`Error: ${response.status} - ${response.statusText}`)
					throw new Error(`Error: ${response.status} - ${response.statusText}`);
			}
			const data = await response.json();
			setProduct(data);
			if(data.customer){
				setNombre(data.customer.cliente)
				setCedula(data.customer.cedula)
			}
		} catch (error) {
			console.error(error.message);
		}
	};

	// Llamar a la función obtenerProducto cada vez que el ID cambie
	useEffect(() => {
		if(user){
			obtenerProducto(); 
		}
	}, [id,user]);
	console.log('product',product)
	const totalCompra = product ? product.items.reduce(
		(total, producto) => {
			if (producto.type === 'stock') {
				return parseFloat(total) + parseFloat(producto.precioTotal);
			} else if (producto.type === 'service') {
				if (!producto.items || producto.items.length === 0) {
					return parseFloat(total) + parseFloat(producto.precioTotal);
				}

				const totalItems = parseFloat(total) + producto.items.reduce((subTotal, item) => parseFloat(subTotal) + parseFloat(item.precioTotal), 0);

				return parseFloat(totalItems) + parseFloat(producto.precioTotal);
			}
			return total;
		},
		0
	) : 0;
	console.log('totalCompra',totalCompra)
	if(loading){
		return <div style={{width:'100%',minHeight:'80vh',display:'flex',justifyContent:'center',alignItems:'center'}}>
			<p>Cargando...</p>
		</div>
	}
	if (!product) {
		return <div>Compra no encontrada</div>;
	}

	return (
		<div className={`${styles.itemContainer} bg-white text-slate-800 dark:bg-slate-700 dark:text-slate-100 border dark:border-slate-600 border-slate-300`}>
			<h1 className={styles.title}>Factura de Compra</h1>
			<Logo/>

			{/* Formulario para ingresar datos del comprador */}
			<div className={styles.inputGroup}>
				<label>Cédula / RIF del Comprador:</label>
				<input
					type='text'
					value={cedula}
					onChange={(e) => setCedula(e.target.value)}
					placeholder='Ingrese la cédula o RIF'
				/>
			</div>

			<div className={styles.inputGroup}>
				<label>Nombre del Comprador:</label>
				<input
					type='text'
					value={nombre}
					onChange={(e) => setNombre(e.target.value)}
					placeholder='Ingrese el nombre del comprador'
				/>
			</div>

			<div className={styles.inputGroup}>
				<label>Método de Pago:</label>
				<select
					value={metodoPago}
					onChange={(e) => setMetodoPago(e.target.value)}
					className='bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 border dark:border-slate-600 border-slate-300'
				>
					<option className='text-slate-800 dark:text-slate-100' value=''>Seleccione un método de pago</option>
					<option className='text-slate-800 dark:text-slate-100' value='Efectivo'>Efectivo</option>
					<option className='text-slate-800 dark:text-slate-100' value='Divisas'>Divisas</option>
					<option className='text-slate-800 dark:text-slate-100' value='Transferencia'>Transferencia</option>
					<option className='text-slate-800 dark:text-slate-100' value='Zelle'>Zelle</option>
					<option className='text-slate-800 dark:text-slate-100' value='Zinli'>Zinli</option>
					<option className='text-slate-800 dark:text-slate-100' value='Binance'>Binance</option>
				</select>
			</div>

			<div className={styles.inputGroup}>
				<label>Fecha de Pago:</label>
				<input
					type='date'
					value={fechaPago}
					onChange={(e) => setFechaPago(e.target.value)}
					className='text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-700 border dark:border-slate-600 border-slate-300'
				/>
			</div>

			<div className={styles.inputGroup}>
				<label>Método de Entrega:</label>
				<select
					value={metodoEntrega}
					onChange={(e) => setMetodoEntrega(e.target.value)}
					className='bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 border dark:border-slate-600 border-slate-300'
				>
					<option className='text-slate-800 dark:text-slate-100' value=''>Seleccione un método de entrega</option>
					<option className='text-slate-800 dark:text-slate-100' value='Envio'>Envío</option>
					<option className='text-slate-800 dark:text-slate-100' value='Retiro'>Retiro en tienda</option>
				</select>
			</div>

			{/* Mostrar la información en la vista de la factura */}
			<div className={styles.facturaContent}>
				<h3 className={styles.productName}>
					ID de Compra: {product.id_factura}
				</h3>
				<p className={styles.date}>
					Fecha: {new Date(product.fecha).toLocaleString()}
				</p>

				<p>
					<strong>Cédula / RIF:</strong> {cedula}
				</p>
				<p>
					<strong>Nombre del Comprador:</strong> {nombre}
				</p>
				<p>
					<strong>Método de Pago:</strong> {metodoPago}
				</p>
				<p>
					<strong>Fecha de Pago:</strong> {fechaPago}
				</p>
				<p>
					<strong>Método de Entrega:</strong> {metodoEntrega}
				</p>

				
				<div className={styles.gridContainer}>
				<div className={`${styles.gridRow} bg-slate-400 dark:bg-slate-600 text-slate-800 dark:text-slate-100 border-slate-300 border-t-1 border-b-1 dark:border-slate-500 [&>div]:border-r-1 [&>div]:border-slate-300 dark:[&>div]:border-slate-500`}>
					<div className={`${styles.gridHeader} first:border-l-1`}>Producto</div>
					<div className={styles.gridHeader}>Tipo</div>
					<div className={styles.gridHeader}>Cantidad</div>
					<div className={styles.gridHeader}>Precio Unitario</div>
					<div className={`${styles.gridHeader} last:border-r-1`}>Precio Total</div>
				</div>
				{product.items.map((producto, index) => (
					<div style={{marginBottom: '-1px'}} key={index}>
						<div className={`${styles.gridRow} text-slate-800 dark:text-slate-100 [&>div]:border-r-1 [&>div]:border-t-1  first:[&>div]:border-t-0 last:[&>div]:border-b-1 [&>div]:border-slate-300 dark:[&>div]:border-slate-500`}>
							<div className={`${styles.gridItem} first:border-l-1`}>{producto.nombre}</div>
							<div className={styles.gridItem}>{producto.type}</div>
							<div className={styles.gridItem}>{producto.cantidad}</div>
							<div className={styles.gridItem}>${producto.precioUnitario}</div>
							<div className={styles.gridItem}>${producto.precioTotal}</div>
						</div>
						{producto.items && producto.items.map((asociado, sub_index) => (
							<div className={`${styles.gridSubRow} text-slate-800 dark:text-slate-100 [&>div]:border-r-1 [&>div]:border-t-1  first:border-t-0 [&>div]:border-b-1 [&>div]:border-slate-300 dark:[&>div]:border-slate-500`} key={sub_index}>
								<div className={`${styles.gridSubItem} first:border-l-4`}>{asociado.nombre}</div>
								<div className={styles.gridSubItem}>{asociado.type}</div>
								<div className={styles.gridItem}>{asociado.cantidad}</div>
								<div className={styles.gridItem}>${asociado.precioUnitario}</div>
								<div className={styles.gridItem}>${asociado.precioTotal}</div>
							</div>
						))}
					</div>
				))}
			</div>
				<div className={styles.totalContainer}>
					<h4 className={styles.totalText}>Total:</h4>
					<span className={styles.totalAmount}>${totalCompra.toFixed(2)}</span>
				</div>
			</div>

			{/* Botón de impresión */}
			<button
				className={`${styles.button} ${styles.printButton}`}
				onClick={() => window.print()}
			>
				Imprimir Factura
			</button>

			<div className={styles.linkContainer}>
				<Link
					href='/sells'
					className={styles.link}
				>
					Volver a Ventas
				</Link>
			</div>
		</div>
	);
}

export default ProductPage;
