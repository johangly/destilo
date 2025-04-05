'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';
import { useAuth } from '@/context/AuthContext';
import BackButton from '@/components/BackButton';
import PrintHeader from '@/components/PrintHeader';

function Page() {
	const [ventas, setVentas] = useState([]);
	const [busqueda, setBusqueda] = useState('');
	const { user } = useAuth();

	// Obtener la lista de ventas desde Firestore
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
			const {datos} = await response.json();
			console.log(datos);
			// Ordenar los productos alfabéticamente antes de guardarlos en el estado
			const ventasOrdenadas = datos.sort((a, b) =>
				a.producto.localeCompare(b.producto)
			);
			setVentas(ventasOrdenadas);
		} catch (error) {
			console.error('Error al cargar ventas:', error.message);
		}
	};

	// Filtrar productos basados en la búsqueda
	const productosFiltrados = ventas
		.filter(
			(venta) =>
				venta.producto.toLowerCase().includes(busqueda.toLowerCase()) ||
				venta.codigo?.toLowerCase().includes(busqueda.toLowerCase())
		)
		.sort((a, b) => a.producto.localeCompare(b.producto));

	useEffect(() => {
		if(user){
			obtenerVentas();
		}
	}, [user]);

	return (
		<div className={styles.page}>
			<div className={`bg-white dark:bg-slate-700 ${styles.container}`}>
				<div>
					<BackButton
						href='/sell-stock/stock'
						text='Volver'
						iconSrc='/backIcon.svg'
					/>
					<PrintHeader />
					<h1 className={`text-slate-800 dark:text-slate-100 ${styles.heading}`}>Lista de Productos agotados</h1>
					<button className={`${styles.button} hideOnPrint mb-2`} style={{padding:'10px 20px',fontWeight:'400',backgroundColor:'#48e', border:'none',borderRadius:'4px'}} onClick={()=>{ window.print() }}>Imprimir reporte</button>
					<div className="hideOnPrint flex items-center text-slate-800 dark:text-slate-100">
						<label className={styles.label} htmlFor='buscar'>Buscar producto</label>
						<input
							type='text'
							id='buscar'
							name='buscar'
							placeholder='Buscar por nombre o código'
							value={busqueda}
							onChange={(e) => setBusqueda(e.target.value)}
							className={`text-slate-800 dark:text-slate-100`}
							style={{
								padding: '8px',
								borderRadius: '5px',
								border: '1px solid #ccc',
								outline: 'none',
								width: '250px',
								marginLeft: '10px',
								marginTop: '10px',
							}}
						/>
					</div>
				</div>
				<table className={styles.table}>
					<thead>
						<tr className="bg-slate-200 dark:bg-slate-600 [&>th]:border-1 [&>th]:border-slate-400 dark:[&>th]:border-slate-400 [&>th]:text-slate-800 dark:[&>th]:text-slate-100">
							<th>Producto</th>
							<th>Cantidad</th>
							<th>Precio Unitario</th>
							<th>Código</th>
							<th>Proveedor</th>
						</tr>
					</thead>
					<tbody>
						{productosFiltrados.map((venta) => {
							if(venta.cantidad <= 3){
								return(
									<tr key={venta.id}>
										<td>{venta.producto}</td>
										<td>{venta.cantidad}</td>
										<td>${venta.precioUnitario}</td>
										<td>{venta.codigo || 'Sin código'}</td>
										<td>{venta.proveedor.nombre || 'Sin proveedor'}</td>
									</tr>
								)
							} 

							return;
						})}
					</tbody>
				</table>
			</div>
		</div>
	);
}

export default Page;
