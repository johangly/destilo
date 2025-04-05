'use client';
import { useState, useEffect } from 'react';
import styles from './page.module.css';
import { useAuth } from '@/context/AuthContext';
import BackButton from '@/components/BackButton';

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
		<div className={`${styles.productsContainer} bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 border-1 border-slate-300 dark:border-slate-500`}>
			<BackButton
				href='/home'
				text='Volver'
				iconSrc='/backIcon.svg'
			/>
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
					<tr className='bg-slate-400 dark:bg-slate-600 text-slate-800 dark:text-slate-100 border-1 border-slate-300 dark:border-slate-500 [&>th]:border-1 [&>th]:border-slate-300 dark:[&>th]:border-slate-500'>
						<th>Producto</th>
						<th>Precio Unitario</th>
					</tr>
				</thead>
				<tbody>
					{filteredAndSortedProducts.map((product, index) => {
						// Verificar y convertir precioUnitario a número
						const precioUnitario = parseFloat(product.precioUnitario) || 0;

						return (
							<tr key={index} className='text-slate-800 dark:text-slate-100 border-1 border-slate-300 dark:border-slate-500 [&>td]:border-1 [&>td]:border-slate-300 dark:[&>td]:border-slate-500'>
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
