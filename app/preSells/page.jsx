'use client';

import { useState, useEffect } from 'react';
import { useListaCompras } from '@/context/sellsContext';
import styles from './page.module.css';
import Link from 'next/link';
import { HomeIcon } from '@/components/Icons';
import { useAuth } from '@/context/AuthContext';

function ListaCompras() {
	const { listaCompras, eliminarProducto, limpiarLista } = useListaCompras();
	const [stock, setStock] = useState([]);
	const [tasa, setTasa] = useState(''); // Estado para la tasa de cambio
	const { user,loading } = useAuth();
	// Obtener la lista de inventario desde Firestore
	const obtenerStock = async () => {
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
			setStock(datos); // Actualiza el estado con los datos obtenidos
		} catch (error) {
			console.error('Error al cargar ventas:', error.message);
		}
	};

	useEffect(() => {
		if(user){
			obtenerStock();
		}
	}, [user]);
	// Calcular el total final en USD
	const totalFinal = listaCompras.reduce(
		(total, producto) => {
			if (producto.type === 'stock') {
				return parseFloat(total) + parseFloat(producto.precioTotal);
			} else if (producto.type === 'service') {
				if (!producto.productosAsociado || producto.productosAsociado.length === 0) {
					return total;
				}

				const totalItems = parseFloat(total) + producto.productosAsociado.reduce((subTotal, item) => parseFloat(subTotal) + parseFloat(item.precioTotal), 0);

				return parseFloat(totalItems) + parseFloat(producto.precioTotal);
			}
			return total;
		},
		0
	);
	// Redondear el total final a dos decimales
	const totalFinalFormateado = totalFinal.toFixed(2);

	// Calcular el total en Bs (multiplicado por la tasa)
	const totalFinalBs = (totalFinal * tasa).toFixed(2);

	// Función para manejar el cambio en la tasa de cambio
	const handleTasaChange = (e) => {
		const nuevaTasa = parseFloat(e.target.value);
		if (!isNaN(nuevaTasa) && nuevaTasa > 0) {
			setTasa(nuevaTasa); // Actualiza la tasa solo si es un valor válido
		}
	};

	// Función para procesar la compra
	const procesarCompra = async () => {
		if (listaCompras.length === 0) {
			alert('No hay productos en la lista para procesar.');
			return;
		}

		// Crear una lista con los productos de stock de la lista de compras
		const newLista = []
		listaCompras.forEach(item => {
			if(item.type === 'stock'){
				newLista.push(item)
			} else if(item.type === 'service'){
				item.productosAsociado.forEach(producto => {
					newLista.push(producto)
				})
			}
		});
		// Verificar si todos los productos tienen suficiente stock
		const productosSinStock = newLista.filter((producto) => {
			const productoEnStock = stock.find((item) => item.id === producto.id);
			return !productoEnStock || producto.cantidad > productoEnStock.cantidad;
		});

		// Si hay productos sin stock suficiente, mostrar alerta y cancelar la compra
		if (productosSinStock.length > 0) {
			const mensajeError = productosSinStock
				.map(
					(producto) =>
						`• ${producto.nombre} (Stock disponible: ${
							stock.find((item) => item.id === producto.id)?.cantidad || 0
						}, Cantidad solicitada: ${producto.cantidad})`
				)
				.join('\n');

			alert(
				`No hay suficiente stock para los siguientes productos:\n${mensajeError}`
			);
			return; // No se procesa la compra si hay problemas de stock
		}

		try {
			// Crear un objeto que agrupe toda la lista de compras
			const compra = {
				fecha: new Date().toISOString(),
				id_factura: Math.floor(Math.random() * 100000000000),
				productos: listaCompras,
			};
			// Enviar el objeto completo a la API
			const response = await fetch('/api/addSells', {
				method: 'POST',
				headers: {
					'X-User-Role': user.role ? user.role.toString() : '',
					'Content-Type': 'application/json'
    			},
				body: JSON.stringify(compra),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || 'Error al procesar la compra');
			}

			alert('Compra procesada con éxito.');

			// Llamar a la función para actualizar las cantidades en stock
			// await actualizarCantidades();
			limpiarLista(); // Limpiar lista después de procesar la compra
		} catch (error) {
			console.error('Error al procesar la compra:', error);
			alert('Ocurrió un error al procesar la compra.');
		}
	};

	// Función para actualizar las cantidades en el stock
	const actualizarCantidades = async () => {
		try {
			// Creamos un arreglo de promesas de actualizaciones
			const promises = listaCompras.map(async (producto) => {
				// Buscar el producto en el stock
				const productoEnStock = stock.find((item) => item.id.toString() === producto.id.toString());

				if (!productoEnStock) {
					throw new Error(
						`Producto no encontrado en el stock: ${producto.nombre}`
					);
				}

				// Verificar si la cantidad vendida supera el stock disponible
				const nuevaCantidad = productoEnStock.cantidad - producto.cantidad;

				// Verificar si la nueva cantidad es negativa o NaN
				if (isNaN(nuevaCantidad) || nuevaCantidad < 0) {
					alert(
						`La cantidad vendida de ${producto.nombre} supera el stock disponible o es inválida.`
					);
					throw new Error(
						`No hay suficiente stock para el producto: ${producto.nombre}`
					);
				}

				// Actualizar la cantidad en el stock
				const response = await fetch('/api/editItemQty', {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						id: producto.id, // ID del producto
						nuevaCantidad, // La nueva cantidad calculada
					}),
				});

				if (!response.ok) {
					const errorData = await response.json();
					throw new Error(
						errorData.error ||
							`Error al actualizar el stock del producto ${producto.nombre}`
					);
				}

				console.log(`Stock actualizado para: ${producto.nombre}`);
			});

			// Ejecutar todas las promesas
			await Promise.all(promises);

			alert('Stock actualizado exitosamente para todos los productos.');
			limpiarLista(); // Limpiar la lista después de procesar
		} catch (error) {
			console.error('Error al actualizar el stock:', error);
			alert('Ocurrió un error al actualizar el stock de los productos.');
		}
	};

	if (listaCompras.length === 0) {
		return (
			<div className={styles.WithoutItemsContainer}>
				<Link href='/home'>
					<HomeIcon />
				</Link>
				<p>No hay productos en la lista de compras.</p>
			</div>
		);
	}

	return (
		<div className={styles.container}>
			<Link href='/home'>
				<HomeIcon />
			</Link>
			<h2 className={styles.heading}>Lista de Compras</h2>
			<div className={styles.tasaUsdBs}>
				<label htmlFor='tasa'>Tasa USD/Bs:</label>
				<input
					id='tasa'
					type='number'
					value={tasa}
					onChange={handleTasaChange} // Actualiza la tasa con el valor del input
					min='0.01' // Prevenir valores negativos o cero
					step='any' // Permitir decimales
				/>
			</div>
			<div className={styles.gridContainer}>
				<div className={styles.gridRow}>
					<div className={styles.gridHeader}>Producto</div>
					<div className={styles.gridHeader}>Tipo</div>
					<div className={styles.gridHeader}>Cantidad</div>
					<div className={styles.gridHeader}>Precio Unitario</div>
					<div className={styles.gridHeader}>Precio Total</div>
					<div className={styles.gridHeader}>Acción</div>
				</div>
				{listaCompras.map((producto, index) => (
					<div key={index}>
						<div className={styles.gridRow}>
							<div className={styles.gridItem}>{producto.nombre}</div>
							<div className={styles.gridItem}>{producto.type}</div>
							<div className={styles.gridItem}>{producto.cantidad}</div>
							<div className={styles.gridItem}>${producto.precioUnitario}</div>
							<div className={styles.gridItem}>${producto.precioTotal}</div>
							<div className={styles.gridItem} style={{ borderRight: '1px solid #ddd' }}>
								<button
									className={styles.deleteButton}
									onClick={() => eliminarProducto(index)}
								>
									Eliminar
								</button>
							</div>
						</div>
						{producto.productosAsociado && producto.productosAsociado.map((asociado, sub_index) => (
							<div className={styles.gridSubRow} key={sub_index}>
								<div className={styles.gridSubItem} style={{ backgroundColor: '#f0f0f0' }}>{asociado.producto}</div>
								<div className={styles.gridSubItem} style={{ backgroundColor: '#f0f0f0' }}>{asociado.type}</div>
								<div className={styles.gridItem} style={{ backgroundColor: '#f0f0f0' }}>{asociado.cantidadInput}</div>
								<div className={styles.gridItem} style={{ backgroundColor: '#f0f0f0' }}>${asociado.precioUnitario}</div>
								<div className={styles.gridItem} style={{ backgroundColor: '#f0f0f0' }}>${Number(asociado.cantidadInput) * Number(asociado.precioUnitario)}</div>
								<div className={styles.gridItem} style={{ backgroundColor: '#f0f0f0', borderRight:'1px solid #ddd'}}>
									<button
										className={styles.deleteButton}
										onClick={() => eliminarProducto(index, sub_index)}
									>
										Eliminar
									</button>
								</div>
							</div>
						))}
					</div>
				))}
			</div>
			<div className={styles.total}>
				<h3>Total Final (USD): ${totalFinalFormateado}</h3>
				<h3>Total Final (Bs): Bs {totalFinalBs}</h3>
			</div>
			<div className={styles.actions}>
				<button
					className={`${styles.button} ${styles.clearButton}`}
					onClick={limpiarLista}
				>
					Limpiar Lista
				</button>
				<button
					className={`${styles.button} ${styles.processButton}`}
					onClick={procesarCompra} // Ahora la función está definida
				>
					Procesar Compra
				</button>
			</div>
		</div>
	);
}

export default ListaCompras;
