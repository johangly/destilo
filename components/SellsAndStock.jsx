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
		<div className={`${styles.sellsAndStock} bg-white dark:bg-slate-700 border-t-4 border-slate-600 rounded-xl`}>
			<div className={styles.sellsAndStock__links}>
				<Link href='/sell-stock/sell'>
					<h2 className="bg-blue-600 text-white">Vender</h2>
				</Link>
				{/* <Link href='/sell-stock/stock'>
					<h2>Inventario</h2>
				</Link> */}
			</div>
			<div className="dark:text-slate-100 text-slate-800">
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
			<div className={`mt-auto flex justify-between items-end text-slate-800 dark:text-slate-100`}>
				<Link 
					href="/soporte" 
					className="text-sm text-blue-500 hover:underline text-center flex justify-start items-end"
				>
					Soporte Tecnico
				</Link>
				<div className='flex justify-end items-end'>
					<Image
						src='/logo-group-1.svg'
						alt='Logo software'
						width={115}
						height={30}
						style={{marginBottom:'-5px'}}
						className="dark:hidden block"
					/>
					<Image
						src='/stockvenLigth.svg'
						alt='Logo software'
						width={115}
						height={30}
						style={{marginBottom:'-5px'}}
						className="dark:block hidden"
					/>
					<p className="text-xs ml-2">v1.1</p>
				</div>
			</div>
		</div>
	);
}

export default SellsAndStock;
