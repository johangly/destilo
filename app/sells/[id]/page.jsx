'use client';

import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import Link from 'next/link';
import Image from 'next/image';

function ProductPage({ params }) {
	const { id } = React.use(params);

	const [product, setProduct] = useState(null);
	const [cedula, setCedula] = useState('');
	const [nombre, setNombre] = useState('');
	const [metodoPago, setMetodoPago] = useState('');
	const [fechaPago, setFechaPago] = useState('');
	const [metodoEntrega, setMetodoEntrega] = useState('');
	
	// Obtener el producto específico basado en el ID
	const obtenerProducto = async () => {
		try {
			const response = await fetch('/api/getSellsData');
			if (!response.ok) throw new Error('Error al obtener las ventas');
			const { datos } = await response.json();
			const productoEncontrado = datos.find((venta) => (
				String(venta.id) === String(id))
			);
			setProduct(productoEncontrado);
		} catch (error) {
			console.error(error.message);
		}
	};

	// Llamar a la función obtenerProducto cada vez que el ID cambie
	useEffect(() => {
		obtenerProducto(); 
	}, [id]);

	console.log('product',product)
	// Calcular la suma total de la compra
	const totalCompra = product
		? product.items.reduce((total, prod) => {
				return total + prod.cantidad * parseFloat(prod.precioUnitario);
		  }, 0)
		: 0;

	if (!product) {
		return <div>Compra no encontrada</div>;
	}

	return (
		<div className={styles.itemContainer}>
			<h1 className={styles.title}>Factura de Compra</h1>
			<Image
				src='/logo.png'
				alt='Logo'
				width={100}
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

				<table className={styles.table}>
					<thead>
						<tr>
							<th>Producto</th>
							<th>Cantidad</th>
							<th>Precio Unitario</th>
							<th>Precio Total</th>
						</tr>
					</thead>
					<tbody>
						{product.items.map((prod, index) => (
							<tr key={index}>
								<td>{prod.nombre}</td>
								<td>{prod.cantidad}</td>
								<td>${parseFloat(prod.precioUnitario).toFixed(2)}</td>
								<td>
									$
									{(prod.cantidad * parseFloat(prod.precioUnitario)).toFixed(2)}
								</td>
							</tr>
						))}
					</tbody>
				</table>

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
