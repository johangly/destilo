'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import { HomeIcon } from '@/components/Icons';

function SellStockPage() {
	const [ventas, setVentas] = useState([]);
	const [busqueda, setBusqueda] = useState('');
	const colors = ['lightcoral', 'lightblue', 'lightgreen'];

	const obtenerVentas = async () => {
		try {
			const response = await fetch('/api/getStocksData', { method: 'GET' });
			if (!response.ok) throw new Error('Error al obtener las ventas');
			const data = await response.json();
			setVentas(data.datos);
		} catch (error) {
			console.error(error.message);
		}
	};

	useEffect(() => {
		obtenerVentas();
	}, []);

	// Filtrar productos según búsqueda
	const productosFiltrados = ventas.filter(
		(product) =>
			product.producto.toLowerCase().includes(busqueda.toLowerCase()) ||
			product.codigo?.toLowerCase().includes(busqueda.toLowerCase())
	);

	return (
		<div className={styles.toSellContainer}>
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
									style={{ backgroundColor: colors[index % colors.length] }}
								>
									<h4 className={styles.productName}>{product.producto}</h4>
									<p className={styles.productPrice}>
										Precio unitario:{' '}
										<strong>
											${parseFloat(product.precioUnitario).toFixed(2)}
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
