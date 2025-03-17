'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';
import Link from 'next/link';
import { DeleteIcon, EditIcon } from '@/components/Icons';
import { useAuth } from '@/context/AuthContext';
import BackButton from '@/components/BackButton';
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
			console.log('datos', datos);
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
			const success = await eliminarProducto(id,user);
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
		if(user){
			obtenerVentas();
		}
	}, [user]);

	return (
		<div className={styles.page}>
			<div className={styles.container}>
				<div>
					<BackButton
						href='/home'
						text='Volver'
						iconSrc='/backIcon.svg'
					/>
					<h1 className={styles.heading}>Lista de Inventario</h1>
					<div style={{display:'flex',gap:'0.5rem'}}>
						<Link href='/addItem'>
							<button className={styles.addButton}>Agregar nuevo producto</button>
						</Link>
						<Link href='/sell-stock/stock/agotado'>
							<button className={styles.addButton} style={{backgroundColor:'#d00'}}>Productos proximos a agotarse</button>
						</Link>
					</div>
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
								.map((venta) => venta.producto + ' (' + venta.proveedor.nombre + ')')
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
								<td>{venta.proveedor.nombre || 'Sin proveedor'}</td>
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
