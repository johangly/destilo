'use client';
import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import Link from 'next/link';
import { useListaCompras } from '@/context/sellsContext';
import { useAuth } from '@/context/AuthContext';

function ProductPage({ params }) {
	const { id } = React.use(params);

	const [cantidad, setCantidad] = useState(1);
	const { agregarProducto } = useListaCompras();
	const [product, setProduct] = useState(null);
	const [ventas, setVentas] = useState([]);
	const { user,loading } = useAuth();
	
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
			const { datos } = await response.json();
			setVentas(datos);
		} catch (error) {
			console.error(error.message);
		}
	};

	useEffect(() => {
		if(user){
			obtenerVentas();
		}
	}, [user]);

	useEffect(() => {
		if (ventas.length > 0) {
			const productoEncontrado = ventas.find(
				(p) => String(p.id) === String(id)
			);
			setProduct(productoEncontrado);
		}
	}, [params, ventas]);

	if (!product) {
		return <div>Producto no encontrado</div>;
	}

	const incrementarCantidad = () => {
		setCantidad((prevCantidad) => prevCantidad + 1);
	};

	const decrementarCantidad = () => {
		if (cantidad > 1) {
			setCantidad((prevCantidad) => prevCantidad - 1);
		}
	};

	// Manejar cambios manuales en el input de cantidad
	const handleCantidadChange = (e) => {
		const valor = e.target.value;
		// Validar que sea un número positivo y mayor a 0
		if (/^\d+$/.test(valor) && parseInt(valor, 10) > 0) {
			setCantidad(parseInt(valor, 10));
		} else if (valor === '') {
			setCantidad('');
		}
	};

	const handleAgregarProducto = () => {
		const precioUnitarioNumber = parseFloat(product.precioUnitario);
		if (isNaN(precioUnitarioNumber)) {
			alert('Error: Precio unitario no es válido');
			return;
		}
		const productoParaAgregar = {
			id: product.id,
			nombre: product.producto,
			codigo: product.codigo,
			cantidad: cantidad,
			type: 'stock',
			precioUnitario: precioUnitarioNumber.toFixed(2),
			precioTotal: (cantidad * precioUnitarioNumber).toFixed(2),
			fecha: new Date().toISOString(),
		};

		agregarProducto(productoParaAgregar);
		alert('Producto agregado a la lista de compras');
	};

	return (
		<div className={`${styles.itemContainer} bg-white dark:bg-slate-600 text-slate-800 dark:text-slate-100 border-1 border-slate-300 dark:border-slate-500`}>
			<h1 className={styles.title}>Detalles del Producto</h1>
			<h3 className={styles.productName}>
				Producto: <span>{product.producto}</span>
			</h3>
			<div className={styles.itemQuantity}>
				<p className={styles.price}>
					Precio unitario:{' '}
					<span>${parseFloat(product.precioUnitario).toFixed(2)}</span>
				</p>
				<div className={styles.quantityControl}>
					<button
						className={styles.decrementButton}
						onClick={decrementarCantidad}
					>
						-
					</button>
					<input
						type='text'
						value={cantidad}
						onChange={handleCantidadChange}
						className={styles.quantityInput}
						style={{
							width: '50px',
							textAlign: 'center',
							border: '1px solid #ccc',
							borderRadius: '5px',
							padding: '5px',
							margin: '0 5px',
						}}
					/>
					<button
						className={styles.incrementButton}
						onClick={incrementarCantidad}
					>
						+
					</button>
				</div>
			</div>
			<button
				className={styles.addButton}
				onClick={handleAgregarProducto}
			>
				Agregar a la lista de compras
			</button>
			<div className={styles.linkContainer}>
				<Link
					href='/sell-stock/sell'
					className={styles.link}
				>
					Volver
				</Link>
				<Link
					href='/preSells'
					className={styles.link}
				>
					Ir a lista
				</Link>
			</div>
		</div>
	);
}

export default ProductPage;
