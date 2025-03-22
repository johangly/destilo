'use client';
import React, { useEffect, useState } from 'react';
import styles from './RevenueDashboard.module.css';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
function RevenueDashboard() {
	const [ventas, setVentas] = useState([]); // Define el estado en el componente
	const { user, loading } = useAuth();

	const obtenerVentas = async () => {
		try {
			if (!user || !user.role) {
				throw new Error('No hay sesión activa');
			}

			const response = await fetch('/api/getSellsData', {
				method: 'GET',
				headers: {
					'X-User-Role': user.role ? user.role.toString() : '',
					'Content-Type': 'application/json'
    			}
			});
			const data = await response.json();
			setVentas(data.datos || []); // Actualiza el estado con los datos obtenidos
		} catch (error) {
			console.error(error.message);
		}
	};

	useEffect(() => {
		if(user){
			obtenerVentas();
		}
	}, [user]);
	// Sumar el precio total de cada venta
	const sumaPrecioTotal = ventas?.length > 0 ? ventas.reduce((acumulador, venta) => {
		// Sumar el precio total de todos los productos dentro de una venta
		const totalVenta = venta.items.reduce((total, producto) => {
			return total + parseFloat(producto.precioTotal);
		}, 0);
		return acumulador + totalVenta;
	}, 0) : 0;

	return (
		<div className={styles.revenueDashboard}>
			<Image src='/navbar-icon.svg' alt='logo' width={220} height={80}/>
			<h2>Consolidado de Ventas</h2>
			<span>
				<p>
					<strong>Fecha de corte:</strong> 2025/02/19
				</p>
				<p>
					<strong>Total de ventas:</strong> $ {sumaPrecioTotal ? sumaPrecioTotal.toFixed(2) : 0}
				</p>
			</span>
			{/* <Image
				src='/slogan.jpeg'
				alt='slogan'
				width={250}
				height={250}
			/> */}
		</div>
	);
}

export default RevenueDashboard;
