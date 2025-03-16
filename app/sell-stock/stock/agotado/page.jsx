'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';
import Link from 'next/link';
import { DeleteIcon, EditIcon, HomeIcon } from '@/components/Icons';
import { useAuth } from '@/context/AuthContext';

// Función para eliminar un producto en Firestore
async function eliminarProducto(id,user) {
	try {
		if (!user || !user.role) {
			throw new Error('No hay sesión activa');
		}

		const response = await fetch('/api/deleteData', {
			method: 'DELETE',
			headers: {
				'X-User-Role': user.role ? user.role.toString() : '',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ id }),
		});

		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(`Error del servidor: ${errorText}`);
		}

		console.log(`Producto con ID ${id} eliminado exitosamente.`);
		return true;
	} catch (error) {
		console.error('Error al eliminar producto:', error);
		return false;
	}
}

function Page() {
	const [ventas, setVentas] = useState([]);
	const [busqueda, setBusqueda] = useState('');
	const { user,loading } = useAuth();

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
			<div className={styles.container}>
				<div>
					<div className={styles.button}>
						<Link
							href='/home'
							style={{ display: 'flex', alignItems: 'center' }}
							
						>
							<HomeIcon /> <p style={{ marginLeft: '10px' }}>Ir a inicio</p>
						</Link>
					</div>
					<h1 className={styles.heading}>Lista de Productos agotados</h1>
					<button className={styles.button} style={{padding:'10px 20px',fontWeight:'400',backgroundColor:'#48e', border:'none',borderRadius:'4px'}} onClick={()=>{ window.print() }}>Imprimir reporte</button>
					<div>
						<label className={styles.label} htmlFor='buscar'>Buscar producto</label>
						<input
							type='text'
							id='buscar'
							name='buscar'
							placeholder='Buscar por nombre o código'
							value={busqueda}
							onChange={(e) => setBusqueda(e.target.value)}
							className={styles.input}
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
						<tr>
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
