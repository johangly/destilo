'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import BackButton from '@/components/BackButton';

function Page() {
	const [ventas, setVentas] = useState([]); // Estado para almacenar las ventas
	const [busqueda, setBusqueda] = useState(''); // Estado para la búsqueda
	const { user } = useAuth();
	// Obtener ventas desde la API
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

			if (!response.ok) throw new Error('Error al obtener las ventas');
			const {datos} = await response.json();
			console.log('resultados de nueva funcion',datos)
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
		if(user){
			obtenerVentas();
		}
	}, [user]);

	// Calcular el monto total de cada venta (sumar precios totales de los productos)
	const calcularMontoTotal = (productos) => {
        if (!Array.isArray(productos)) return 0;
        return productos.reduce((total, producto) => {
            if (producto.type === 'stock') {
                return parseFloat(total) + parseFloat(producto.precioTotal);
            } else if (producto.type === 'service') {
                if (!producto.items || producto.items.length === 0) {
                    return total;
                }
                const totalItems = producto.items.reduce((subTotal, item) => parseFloat(subTotal) + parseFloat(item.precioTotal), 0);
                return parseFloat(total) + parseFloat(totalItems) + parseFloat(producto.precioTotal);
            }
            return total;
        }, 0);
    };

	const ventasFiltradas = ventas.filter((venta) =>
		venta.id_factura.toString().includes(busqueda.trim())
	);
	
	return (
		<div className={`${styles.container} bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 border-1 border-slate-300 dark:border-slate-500`}>
			<BackButton
				href='/home'
				text='Volver'
				iconSrc='/backIcon.svg'
			/>
			<h1 className={styles.heading}>Control de Facturación</h1>

			<div style={{ display: 'flex', gap: '10px' }}>
				<Link href='/sells/extracto-ventas'>
					<button style={{ backgroundColor: '#007bff'}} className={styles.actionButton}>Ver Extracto de Ventas</button>
				</Link>
				<Link href='/sells/week-sells'>
					<button style={{ backgroundColor: '#ff9800'}} className={styles.actionButton}>Ver Ventas de la semana</button>
				</Link>
				<Link href='/sells/best-sells'>
					<button style={{ backgroundColor: '#00e676'}} className={styles.actionButton}>Ver Productos mas vendidos</button>
				</Link>
				<Link href='/sells/best-services'>
					<button style={{ backgroundColor: '#4b9efb'}} className={styles.actionButton}>Ver Servicios mas vendidos</button>
				</Link>
			</div>

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
					<tr className="bg-slate-400 dark:bg-slate-600 text-slate-800 dark:text-slate-100 border-1 border-slate-300 dark:border-slate-500 [&>th]:border-1 [&>th]:border-slate-300 dark:[&>th]:border-slate-500">
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
							<tr key={venta.id} className='text-slate-800 dark:text-slate-100 border-1 border-slate-300 dark:border-slate-500 [&>td]:border-1 [&>td]:border-slate-300 dark:[&>td]:border-slate-500'>
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
