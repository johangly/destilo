'use client';
import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import Link from 'next/link';
import { useListaCompras } from '@/context/sellsContext';
import { useAuth } from '@/context/AuthContext';

function ProductPage({ params }) {
	const { id } = React.use(params);

	const [cantidad, setCantidad] = useState(1);
	const [productoSeleccionado, setProductoSeleccionado] = useState('');
	const [productosAsociados, setProductosAsociados] = useState([]);
	const { agregarProducto } = useListaCompras();
	const [product, setProduct] = useState(null);
	const [servicios, setServicios] = useState([]);
	const [ventas, setVentas] = useState([]);
	const { user,loading } = useAuth();
	const obtenerServicios = async () => {
		try {
			if (!user || !user.uid) {
				throw new Error('No hay sesión activa');
			}

			const response = await fetch('/api/getServices', {
				method: 'GET',
				headers: {
					'X-User-Id': user.uid ? user.uid.toString() : '',
					'Content-Type': 'application/json'
    			}
			});

			if (!response.ok) throw new Error('Error al obtener las ventas');
			const { data } = await response.json();
			setServicios(data);
		} catch (error) {
			console.error(error.message);
		}
	};

	const obtenerVentas = async () => {
		try {
			if (!user || !user.uid) {
				throw new Error('No hay sesión activa');
			}

			const response = await fetch('/api/getStocksData', {
				method: 'GET',
				headers: {
					'X-User-Id': user.uid ? user.uid.toString() : '',
					'Content-Type': 'application/json'
    			}
			});
			if (!response.ok) throw new Error('Error al obtener las ventas');
			const data = await response.json();
			setVentas(data.datos);
		} catch (error) {
			console.error(error.message);
		}
	};


	useEffect(() => {
		if(user){
			obtenerServicios();
			obtenerVentas();
		}
	}, [user]);

	useEffect(() => {
		if (servicios.length > 0) {
			const servicioEncontrado = servicios.find(
				(p) => String(p.id) === String(id)
			);
			setProduct(servicioEncontrado);
		}
	}, [params, servicios]);

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

	const agregarProductoAsociado = () => {
		setProductosAsociados([...productosAsociados, {
			id: '',
			nombre: '',
			codigo: '',
			cantidad: 1,
			precioUnitario: 0,
			precioTotal: 0,
			fecha:'',
			cantidadInput:1
		 }]);
	};

	const manejarCambioProducto = (index, campo, valor) => {
		const nuevosProductos = [...productosAsociados];
		nuevosProductos[index][campo] = valor;
		const productoEncontrado = ventas.find((producto) => producto.id.toString() === valor.toString());
		nuevosProductos[index] = {...productoEncontrado,cantidadInput:1}
		setProductosAsociados(nuevosProductos);
	};

	const manejarCambioCantidad = (index, incremento) => {
		const nuevosProductos = [...productosAsociados];
		const nuevaCantidad = Number(nuevosProductos[index].cantidadInput) + Number(incremento);
		if (nuevaCantidad > 0) {
			nuevosProductos[index].cantidadInput = nuevaCantidad;
			setProductosAsociados(nuevosProductos);
		}
	};

	const eliminarProductoAsociado = (index) => {
		const nuevosProductos = productosAsociados.filter((_, i) => i !== index);
		setProductosAsociados(nuevosProductos);
	};
	console.log('ventas PORRRRRRRRR',ventas)
	const handleAgregarProducto = () => {
		const precioPorUnidadDeServicio = parseFloat(product.precio);
		if (isNaN(precioPorUnidadDeServicio)) {
			alert('Error: Precio unitario no es válido');
			return;
		}
	
		const productoParaAgregar = {
			id: product.id,
			nombre: product.servicio,
			codigo: product.descripcion,
			cantidad: cantidad,
			precioUnitario: precioPorUnidadDeServicio.toFixed(2),
			precioTotal: (cantidad * precioPorUnidadDeServicio).toFixed(2),
			fecha: new Date().toISOString(),
			productosAsociado: [...productosAsociados]
		};
		console.log('productoParaAgregar',productoParaAgregar)
		agregarProducto(productoParaAgregar);
		alert('Producto agregado a la lista de compras');
	};

	return (
		<div className={styles.itemContainer}>
			<h1 className={styles.title}>Detalles del Producto</h1>
			<h3 className={styles.productName}>
				Producto: <span>{product.producto}</span>
			</h3>
			<div className={styles.itemQuantity}>
				<p className={styles.price}>
					Precio por cada servicio:{' '}
					<span>${parseFloat(product.precio).toFixed(2)}</span>
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
			{/* <div style={{ marginBottom: '20px',marginTop:'20px' }}>
				<label htmlFor="productos" style={{ display: 'block', marginBottom: '10px' }}>
					Selecciona un producto asociado:
				</label>
				<select
					id="productos"
					value={productoSeleccionado}
					onChange={(e) => setProductoSeleccionado(e.target.value)}
					style={{
						width: '100%',
						padding: '8px',
						borderRadius: '5px',
						border: '1px solid #ccc'
					}}
				>
					<option value="">Seleccione un producto</option>
					{ventas.map((producto) => (
						<option 
							key={producto.id} 
							value={producto.id}
							disabled={productosAsociados.some(p => p.id === producto.id)}
						>
							{producto.producto} - ${parseFloat(producto.precioUnitario).toFixed(2)} - {producto.cantidad} u.
						</option>
					))}
				</select>
			</div> */}
			<button
				className={styles.addButton}
				onClick={handleAgregarProducto}
			>
				Agregar a la lista de compras
			</button>
			<button onClick={agregarProductoAsociado} className={styles.addButton} style={{backgroundColor:'#007bff',borderColor:'#007bff',marginTop:'0'}}>
				Agregar Producto Asociado
			</button>
			{productosAsociados.map((producto, index) => (
				<div key={index} style={{ marginBottom: '20px', marginTop: '20px' }}>
					<select
						value={producto.id}
						onChange={(e) => manejarCambioProducto(index, 'id', e.target.value)}
						style={{
							width: '100%',
							padding: '8px',
							borderRadius: '5px',
							border: '1px solid #ccc'
						}}
					>
						<option value="">Seleccione un producto</option>
						{ventas.map((producto) => (
							<option 
								key={producto.id} 
								value={producto.id}
								disabled={productosAsociados.some(p => p.id === producto.id && productosAsociados[index].id !== producto.id)}
							>
								{producto.producto} - ${parseFloat(producto.precioUnitario).toFixed(2)}
							</option>
						))}
					</select>
					<div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
						<button onClick={() => manejarCambioCantidad(index, -1)} style={{ marginRight: '10px' }} className={styles.decrementButton}>-</button>
						<input
							type='text'
							value={producto.cantidadInput}
							readOnly
							style={{
								width: '50px',
								textAlign: 'center',
								border: '1px solid #ccc',
								borderRadius: '5px',
								padding: '5px',
								margin: '0 5px',
							}}
						/>
						<button onClick={() => manejarCambioCantidad(index, 1)} style={{ marginLeft: '10px' }} className={styles.incrementButton}>+</button>
						<button className={styles.addButton} onClick={() => eliminarProductoAsociado(index)} style={{ marginLeft: '10px', backgroundColor: 'red', color: 'white', maxWidth: '100px' }}>Eliminar</button>
					</div>
				</div>
			))}
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
