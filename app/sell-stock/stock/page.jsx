'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';
import Link from 'next/link';
import { DeleteIcon, EditIcon, HomeIcon } from '@/components/Icons';

// Función para eliminar un producto en Firestore
async function eliminarProducto(id) {
	try {
		const response = await fetch('/api/deleteData', {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
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

	// Obtener la lista de ventas desde Firestore
	const obtenerVentas = async () => {
		try {
			const response = await fetch('/api/getStocksData', { method: 'GET' });
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

	// Manejar la eliminación de un producto
	const handleEliminar = async (id) => {
		const confirmDelete = window.confirm(
			'¿Seguro que deseas eliminar este producto?'
		);
		if (confirmDelete) {
			const success = await eliminarProducto(id);
			if (success) {
				// Actualiza la lista después de la eliminación
				setVentas((prevVentas) =>
					prevVentas.filter((venta) => venta.id !== id)
				);
			}
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
		obtenerVentas();
	}, []);

	return (
		<div className={styles.page}>
			<div className={styles.container}>
				<div>
					<Link
						href='/home'
						style={{ display: 'flex', alignItems: 'center' }}
					>
						<HomeIcon /> <p style={{ marginLeft: '10px' }}>Ir a inicio</p>
					</Link>
					<h1 className={styles.heading}>Lista de Inventario</h1>
					<Link href='/addItem'>
						<button className={styles.addButton}>Agregar nuevo producto</button>
					</Link>
					<div>
						<label htmlFor='buscar'>Buscar producto</label>
						<input
							type='text'
							id='buscar'
							name='buscar'
							placeholder='Buscar por nombre o código'
							value={busqueda}
							onChange={(e) => setBusqueda(e.target.value)}
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
				<div>
					{/* Aviso de poco stock */}
					{ventas.some((venta) => venta.cantidad < 3) && (
						<p className={styles.stockWarning}>
							<strong>Productos con stock menor a 3 unidades:</strong>{' '}
							{ventas
								.filter((venta) => venta.cantidad <= 3)
								.map((venta) => venta.producto + ' (' + venta.proveedor + ')')
								.join(', ')}
						</p>
					)}
				</div>
				<table className={styles.table}>
					<thead>
						<tr>
							<th>Producto</th>
							<th>Cantidad</th>
							<th>Precio Unitario</th>
							<th>Código</th>
							<th>Proveedor</th>
							<th>Acciones</th>
						</tr>
					</thead>
					<tbody>
						{productosFiltrados.map((venta) => (
							<tr key={venta.id}>
								<td>{venta.producto}</td>
								<td>{venta.cantidad}</td>
								<td>${venta.precioUnitario}</td>
								<td>{venta.codigo || 'Sin código'}</td>
								<td>{venta.proveedor || 'Sin proveedor'}</td>
								<td className={styles.actionButtonsContainer}>
									<Link href={`/sell-stock/stock/${venta.id}`}>
										<button className={styles.actionButton}>
											<EditIcon />
										</button>
									</Link>
									<button
										className={styles.actionButton}
										onClick={() => handleEliminar(venta.id)}
									>
										<DeleteIcon />
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}

export default Page;
