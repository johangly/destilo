'use client';
import React, { useEffect, useState } from 'react';
import styles from './SellsAndStock.module.css';
import Link from 'next/link';
import Image from 'next/image';

function SellsAndStock() {
	const [ventas, setVentas] = useState([]);

	const obtenerVentas = async () => {
		try {
			const response = await fetch('/api/getSellsData', { method: 'GET' });
			if (!response.ok) throw new Error('Error al obtener las ventas');
			const data = await response.json();
			setVentas(data);
		} catch (error) {
			console.error(error.message);
		}
	};

	useEffect(() => {
		obtenerVentas();
	}, []);

	// Extraer solo los primeros 6 productos en total
	const productosLimitados = [];
	for (const venta of ventas) {
		for (const producto of venta.productos) {
			if (productosLimitados.length < 6) {
				productosLimitados.push(producto);
			} else {
				break;
			}
		}
		if (productosLimitados.length >= 6) break;
	}

	return (
		<div className={styles.sellsAndStock}>
			<div className={styles.sellsAndStock__links}>
				<Link href='/sell-stock/sell'>
					<h2>Vender</h2>
				</Link>
				<Link href='/sell-stock/stock'>
					<h2>Inventario</h2>
				</Link>
			</div>
			<div>
				<h3>Ventas recientes</h3>
				<ul>
					{productosLimitados.map((producto, index) => (
						<li key={index}>
							<Image
								src='https://cdn-icons-png.flaticon.com/512/8221/8221097.png'
								alt='Venta'
								width={20}
								height={20}
							/>
							<span>{producto.nombre}</span>
						</li>
					))}
				</ul>
			</div>
			<div className={styles.sellsAndStock__logo}>
				<p>Stockven v1.0</p>
				<Image
					src='/logo_dos.jpeg'
					alt='Logo software'
					width={60}
					height={60}
				/>
			</div>
		</div>
	);
}

export default SellsAndStock;
