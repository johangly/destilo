'use client';
import React, { useEffect, useState } from 'react';
import styles from './RevenueDashboard.module.css';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
function RevenueDashboard() {
	const [ventas, setVentas] = useState([]); // Define el estado en el componente
	const { user } = useAuth();
	// console.log('userrrr',user)
	// console.log('Información del usuario antes de la petición:', {
	// 	userObject: user,
	// 	userId: user ? user.uid.toString() : '',
	// 	userIdType: user ? typeof user.uid : '' 
	// });
	// console.log('user: RevenueDashboard:',user)
	const obtenerVentas = async () => {
		try {
			if (!user || !user.uid) {
				throw new Error('No hay sesión activa');
			}

			const response = await fetch('/api/getSellsData', {
				method: 'GET',
				headers: {
					'X-User-Id': user.uid ? user.uid.toString() : '',
					'Content-Type': 'application/json'
    			}
			});
			const data = await response.json();
			setVentas(data.datos); // Actualiza el estado con los datos obtenidos
		} catch (error) {
			console.error(error.message);
		}
	};

	useEffect(() => {
		if(user){
			obtenerVentas();
		}
	}, [user]);
	console.log('ventas',ventas)
	// Sumar el precio total de cada venta
	const sumaPrecioTotal = ventas.reduce((acumulador, venta) => {
		// Sumar el precio total de todos los productos dentro de una venta
		const totalVenta = venta.items.reduce((total, producto) => {
			return total + parseFloat(producto.precioTotal);
		}, 0);
		return acumulador + totalVenta;
	}, 0);

	return (
		<div className={styles.revenueDashboard}>
			<h2>Consolidado de Ventas</h2>
			<span>
				<p>
					<strong>Fecha de corte:</strong> 2025/02/19
				</p>
				<p>
					<strong>Total de ventas:</strong> $ {sumaPrecioTotal.toFixed(2)}
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
