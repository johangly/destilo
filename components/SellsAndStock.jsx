'use client';
import React, { useEffect, useState } from 'react';
import styles from './SellsAndStock.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';

function SellsAndStock() {
	const [ventas, setVentas] = useState([]);
	const { user } = useAuth();
	const obtenerVentas = async () => {
		try {
			if (!user || !user.role) {
				throw new Error('No hay sesión activa');
			}
			const response = await fetch('/api/getSellsData', {
				method: 'GET',
				headers: {
					'X-User-Role': user.role,
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

	useEffect(() => {
		if(user){
			obtenerVentas();
		}
	}, [user]);

	// Extraer solo los primeros 6 productos en total
	const productosLimitados = [];
	for (const venta of ventas) {
		for (const producto of venta.items) {
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
				{/* <Link href='/sell-stock/stock'>
					<h2>Inventario</h2>
				</Link> */}
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
			<div style={{ flex:'none',display: 'flex', alignItems: 'center',justifyContent:'center',gap:'5px',marginTop:'auto' }} className={styles.sellsAndStock__logo}>
				<Image
					src='/logo-group-1.svg'
					alt='Logo software'
					width={150}
					height={40}
					style={{marginBottom:'8px'}}
				/>
				<p>v1.0</p>
			</div>
		</div>
	);
}

export default SellsAndStock;
