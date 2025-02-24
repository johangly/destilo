'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';
import Link from 'next/link';
import { HomeIcon } from '@/components/Icons';

function Page() {
	const [ventas, setVentas] = useState([]); // Estado para almacenar las ventas
	const [busqueda, setBusqueda] = useState(''); // Estado para la búsqueda

	// Obtener ventas desde la API
	const obtenerVentas = async () => {
		try {
			const response = await fetch('/api/getSellsData', { method: 'GET' });
			if (!response.ok) throw new Error('Error al obtener las ventas');
			const {datos} = await response.json();

			// Ordenar por fecha (más reciente primero)
			const ventasOrdenadas = datos.sort(
				(a, b) => new Date(b.fecha) - new Date(a.fecha)
			);

			setVentas(ventasOrdenadas);
		} catch (error) {
			console.error('Error obteniendo ventas:', {
				message: error.message || 'Error desconocido',
				stack: error.stack,
				response: error.response?.datos
			});
		}
	};

	useEffect(() => {
		obtenerVentas();
	}, []);

	// Calcular el monto total de cada venta (sumar precios totales de los productos)
	const calcularMontoTotal = (productos) => {
		if (!Array.isArray(productos)) return 0;
		return productos.reduce((total, producto) => {
			const precioTotal = parseFloat(producto.precioTotal) || 0;
			return total + precioTotal;
		}, 0);
	};

	const ventasFiltradas = ventas.filter((venta) =>
		venta.id_factura.toString().includes(busqueda.trim())
	);
	console.log(ventasFiltradas)
	return (
		<div className={styles.container}>
			<Link
				href='/home'
				style={{ display: 'flex', alignItems: 'center' }}
			>
				<HomeIcon /> <p style={{ marginLeft: '5px' }}>Ir a inicio</p>
			</Link>
			<h1 className={styles.heading}>Control de Facturación</h1>

			<Link href='/sells/extracto-ventas'>
				<button className={styles.actionButton}>Ver Extracto de Ventas</button>
			</Link>

			{/* Buscador de facturas */}
			<input
				type='text'
				placeholder='Buscar por ID de factura...'
				value={busqueda}
				onChange={(e) => setBusqueda(e.target.value)}
				className={styles.searchInput}
				style={{
					display: 'block',
					padding: '10px',
					margin: '10px 0',
					borderRadius: '5px',
					border: '1px solid #ccc',
					fontSize: '16px',
				}}
			/>

			<table className={styles.table}>
				<thead>
					<tr>
						<th>ID de la Compra</th>
						<th>Fecha y Hora</th>
						<th>Monto Total</th>
						<th>Acción</th>
					</tr>
				</thead>
				<tbody>
					{ventasFiltradas.map((venta) => {
						const fechaFormateada = new Date(venta.fecha).toLocaleString();
						return (
							<tr key={venta.id}>
								<td>{venta.id_factura}</td>
								<td>{fechaFormateada}</td>
								<td>${calcularMontoTotal(venta.items).toFixed(2)}</td>
								<td>
									<Link href={`/sells/${venta.id}`}>
										<button className={styles.actionButton}>
											Ver Detalles
										</button>
									</Link>
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}

export default Page;
