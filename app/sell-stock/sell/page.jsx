'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import { HomeIcon } from '@/components/Icons';
import { useAuth } from '@/context/AuthContext';

function SellStockPage() {
	const [ventas, setVentas] = useState([]);
	const [servicios, setServicios] = useState([]);
	const [busqueda, setBusqueda] = useState('');
	const colors = ['lightcoral', 'lightblue', 'lightgreen'];
	const { user } = useAuth();
	const obtenerVentas = async () => {
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
			if (!response.ok) throw new Error('Error al obtener las ventas');
			const data = await response.json();
			setVentas(data.datos);
		} catch (error) {
			console.error(error.message);
		}
	};

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
			if (!response.ok) throw new Error('Error al obtener las ventas');
			const data = await response.json();
			console.log('consultando servicios',data)
			setServicios(data.data);
		} catch (error) {
			console.error(error.message);
		}
	};

	useEffect(() => {
		if(user){
			obtenerVentas();
			obtenerServicios();
		}
	}, [user]);

	// Filtrar productos según búsqueda
	const productosFiltrados = ventas.filter(
		(product) =>
			product.producto.toLowerCase().includes(busqueda.toLowerCase()) ||
			product.codigo?.toLowerCase().includes(busqueda.toLowerCase())
	);
	console.log('servicios',servicios)
	const serviciosFiltrados = servicios.filter(
		(servicio) =>
			servicio.servicio.toLowerCase().includes(busqueda.toLowerCase()) ||
		servicio.descripcion?.toLowerCase().includes(busqueda.toLowerCase())
	);

	return (
		<div className={styles.toSellContainer} style={{display:'flex',flexDirection:'column',gap:'25px'}}>
			<Link href='/home'>
				<HomeIcon />
			</Link>
			<h1 className={styles.title}>Productos a la Venta</h1>

			{/* Input de búsqueda */}
			<div style={{ marginBottom: '15px', textAlign: 'center' }}>
				<input
					type='text'
					placeholder='Buscar producto o código...'
					value={busqueda}
					onChange={(e) => setBusqueda(e.target.value)}
					style={{
						padding: '8px',
						borderRadius: '5px',
						border: '1px solid #ccc',
						outline: 'none',
						width: '250px',
					}}
				/>
			</div>
			<div>
				<p style={{marginBottom:'10px'}}>Productos</p>
				<div className={styles.productsToSellContainer}>
					{productosFiltrados.length > 0 ? (
						productosFiltrados.map((product, index) => (
							<div key={index}>
								<Link
									href={`/sell-stock/sell/${product.id}`}
									className={styles.productLink}
								>
									<div
										className={styles.productToSell}
										style={{
											backgroundColor: product.cantidad > 4 ? "#ccc" : "#e65272",
										}}
									>
										<h4 className={styles.productName} style={{color: product.cantidad > 4 ? "#333" : "#fff"}}>{product.producto}</h4>
										<p className={styles.productPrice} style={{color: product.cantidad > 4 ? "#333" : "#fff", marginBottom:'5px'}}>
											Precio unitario:{' '}
											<strong style={{color: product.cantidad > 4 ? "#333" : "#fff"}}>
												${parseFloat(product.precioUnitario).toFixed(2)}
											</strong>
										</p>
										<p className={styles.productPrice} style={{color: product.cantidad > 4 ? "#333" : "#fff"}}>Cantidad en inventario: 
											<strong style={{color: product.cantidad > 4 ? "#333" : "#fff"}}>
												{product.cantidad}
											</strong>
										</p>
									</div>
								</Link>
							</div>
						))
					) : (
						<p style={{ textAlign: 'center', color: '#888' }}>
							No se encontraron productos.
						</p>
					)}
				</div>
			</div>
			<div>
				<p style={{marginBottom:'10px'}}>Servicios</p>
				<div className={styles.productsToSellContainer}>
					{serviciosFiltrados.length > 0 ? (
						serviciosFiltrados.map((servicio, index) => (
							<div key={index}>
								<Link
									href={`/sell-stock/sell/service/${servicio.id}`}
									className={styles.productLink}
								>
									<div
										className={styles.productToSell}
										style={{
											backgroundColor: "#ccc",
										}}
									>
										<h4 className={styles.productName} style={{color: "#333"}}>{servicio.servicio}</h4>
										<p className={styles.productPrice} style={{color: "#333"}}>
											Precio unitario:{' '}
											<strong style={{color: "#333"}}>
												${parseFloat(servicio.precio).toFixed(2)}
											</strong>
										</p>
									</div>
								</Link>
							</div>
						))
					) : (
						<p style={{ textAlign: 'center', color: '#888' }}>
							No se encontraron productos.
						</p>
					)}
				</div>
			</div>

			<Link
				href='/preSells'
				className={styles.backButton}
			>
				Ir a la lista
			</Link>
		</div>
	);
}

export default SellStockPage;
