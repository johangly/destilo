'use client';

import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';

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

	const totalCompra = product ? product.items.reduce(
		(total, producto) => {
			if (producto.type === 'stock') {
				return parseFloat(total) + parseFloat(producto.precioTotal);
			} else if (producto.type === 'service') {
				if (!producto.items || producto.items.length === 0) {
					return total;
				}

				const totalItems = parseFloat(total) + producto.items.reduce((subTotal, item) => parseFloat(subTotal) + parseFloat(item.precioTotal), 0);

				return parseFloat(totalItems) + parseFloat(producto.precioTotal);
			}
			return total;
		},
		0
	) : 0;

	if(loading){
		return <div style={{width:'100%',minHeight:'80vh',display:'flex',justifyContent:'center',alignItems:'center'}}>
			<p>Cargando...</p>
		</div>
	}
	if (!product) {
		return <div>Compra no encontrada</div>;
	}

	return (
		<div className={styles.itemContainer}>
			<h1 className={styles.title}>Factura de Compra</h1>
			<Image
				src='/logo.png'
				alt='Logo'
				width={180}
				height={50}
			/>

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
				>
					<option value=''>Seleccione un método de pago</option>
					<option value='Efectivo'>Efectivo</option>
					<option value='Divisas'>Divisas</option>
					<option value='Transferencia'>Transferencia</option>
					<option value='Zelle'>Zelle</option>
					<option value='Zinli'>Zinli</option>
					<option value='Binance'>Binance</option>
				</select>
			</div>

			<div className={styles.inputGroup}>
				<label>Fecha de Pago:</label>
				<input
					type='date'
					value={fechaPago}
					onChange={(e) => setFechaPago(e.target.value)}
				/>
			</div>

			<div className={styles.inputGroup}>
				<label>Método de Entrega:</label>
				<select
					value={metodoEntrega}
					onChange={(e) => setMetodoEntrega(e.target.value)}
				>
					<option value=''>Seleccione un método de entrega</option>
					<option value='Envio'>Envío</option>
					<option value='Retiro'>Retiro en tienda</option>
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
				<div className={styles.gridRow}>
					<div className={styles.gridHeader}>Producto</div>
					<div className={styles.gridHeader}>Tipo</div>
					<div className={styles.gridHeader}>Cantidad</div>
					<div className={styles.gridHeader}>Precio Unitario</div>
					<div className={styles.gridHeader}>Precio Total</div>
				</div>
				{product.items.map((producto, index) => (
					<div style={{marginBottom: '-1px'}} key={index}>
						<div className={styles.gridRow}>
							<div className={styles.gridItem}>{producto.nombre}</div>
							<div className={styles.gridItem}>{producto.type}</div>
							<div className={styles.gridItem}>{producto.cantidad}</div>
							<div className={styles.gridItem}>${producto.precioUnitario}</div>
							<div className={styles.gridItem} style={{ borderRight: '1px solid #ddd' }}>${producto.precioTotal}</div>
						</div>
						{producto.items && producto.items.map((asociado, sub_index) => (
							<div className={styles.gridSubRow} key={sub_index}>
								<div className={styles.gridSubItem} style={{ backgroundColor: '#f0f0f0' }}>{asociado.nombre}</div>
								<div className={styles.gridSubItem} style={{ backgroundColor: '#f0f0f0' }}>{asociado.type}</div>
								<div className={styles.gridItem} style={{ backgroundColor: '#f0f0f0' }}>{asociado.cantidad}</div>
								<div className={styles.gridItem} style={{ backgroundColor: '#f0f0f0' }}>${asociado.precioUnitario}</div>
								<div className={styles.gridItem} style={{ backgroundColor: '#f0f0f0', borderRight:'1px solid #ddd'}} >${asociado.precioTotal}</div>

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
