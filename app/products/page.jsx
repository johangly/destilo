'use client';
import { useState, useEffect } from 'react';
import styles from './page.module.css';
import Link from 'next/link';
import { HomeIcon } from '@/components/Icons';
import { useAuth } from '@/context/AuthContext';

function Page() {
	const [productos, setProductos] = useState([]);
	const [searchQuery, setSearchQuery] = useState(''); // Estado para la búsqueda
	const { user,loading } = useAuth();
	// Función para obtener productos desde la API
	const obtenerProductos = async () => {
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

			if (!response.ok) throw new Error('Error al obtener los productos');
			const { datos } = await response.json();
			setProductos(datos); // Actualiza el estado con los datos obtenidos
		} catch (error) {
			console.error(error.message);
		}
	};

	// Llamada a obtener productos cuando el componente se monta
	useEffect(() => {
		if(user){
			obtenerProductos();
		}
	}, [user]);

	// Filtrar y ordenar productos alfabéticamente por nombre
	const filteredAndSortedProducts = productos
		.filter((product) =>
			product.producto.toLowerCase().includes(searchQuery.toLowerCase())
		)
		.sort((a, b) => a.producto.localeCompare(b.producto));

	return (
		<div className={styles.productsContainer}>
			<Link
				href='/home'
				style={{ display: 'flex', alignItems: 'center' }}
			>
				<HomeIcon /> <p style={{ marginLeft: '10px' }}>Ir a inicio</p>
			</Link>
			<h1>Nuestros Productos</h1>

			{/* Sección de búsqueda */}
			<input
				type='text'
				placeholder='Buscar producto...'
				value={searchQuery}
				onChange={(e) => setSearchQuery(e.target.value)}
				className={styles.searchInput}
			/>

			<table className={styles.table}>
				<thead>
					<tr>
						<th>Producto</th>
						<th>Precio Unitario</th>
					</tr>
				</thead>
				<tbody>
					{filteredAndSortedProducts.map((product, index) => {
						// Verificar y convertir precioUnitario a número
						const precioUnitario = parseFloat(product.precioUnitario) || 0;

						return (
							<tr key={index}>
								<td>{product.producto}</td>
								<td>${precioUnitario.toFixed(2)}</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}

export default Page;
