'use client';

import { useState, useEffect } from 'react';
import { useListaCompras } from '@/context/sellsContext';
import styles from './page.module.css';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import BackButton from '@/components/BackButton';

function ListaCompras() {
	const { listaCompras, eliminarProducto, limpiarLista } = useListaCompras();
	const [stock, setStock] = useState([]);
	const [tasa, setTasa] = useState(''); // Estado para la tasa de cambio
	const { user,loading } = useAuth();
	const [empresa, setEmpresa] = useState(false);
	const [clientData, setClientData] = useState({
		cliente: '',
		cedula: '',
		telefono: '',
		email: '',
		direccion: '',
		nrocasa: '',
		ciudad: '',
		provincia: '',
		pais: '',
		empresa: '',
		rif: '',
	});
	const [allCustomers, setAllCustomers] = useState([]); // Todos los clientes
	const [selectedCustomer, setSelectedCustomer] = useState({
		id: 0,});

	const handleChange = (e) => {
		const { id, value } = e.target;
		let newValue = value;

		// Restringir el campo "cliente" a solo letras y espacios
		if (id === 'cliente') {
			newValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
		}

		setClientData((prevData) => ({
			...prevData,
			[id]: newValue, // Asignamos el valor filtrado
		}));
	};

	const handleChangeTelefono = (e) => {
		let value = e.target.value.replace(/\D/g, ''); // Elimina caracteres no numéricos

		// Aplica el formato (0XXX)XXXXXXX
		if (value.length >= 4) {
			value = `(${value.slice(0, 4)})${value.slice(4, 11)}`;
		}

		// Limita la cantidad de caracteres a 13
		if (value.length > 13) {
			value = value.slice(0, 13);
		}

		setClientData({ ...clientData, telefono: value });
	};
	
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

	const getCustomers = async () => {
		try {
			if (!user || !user.role) {
				throw new Error('No hay sesión activa');
			}

			const response = await fetch('/api/getCustomers', {
				method: 'GET',
				headers: {
					'X-User-Role': user.role ? user.role.toString() : '',
					'Content-Type': 'application/json'
    			}
			});

			if (!response.ok) throw new Error('Error al obtener los clientes');
			const { data } = await response.json();
			console.log('customers',data)
			setAllCustomers(data);
		} catch (error) {
			console.error(error.message);
		}
	};

	useEffect(() => {
		if(user){
			obtenerStock();
			getCustomers();
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
			// crea un nuevo cliente si no existe
			const clientId = await crearClienteSiNoExiste();

			if(!clientId) {
				alert('Ocurrió un error al crear el cliente.');
				return;
			}

			// Crear un objeto que agrupe toda la lista de compras
			const compra = {
				fecha: new Date().toISOString(),
				id_factura: Math.floor(Math.random() * 100000000000),
				productos: listaCompras,
				customer_id: clientId
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
				<BackButton
					href='/home'
					text='Volver'
					iconSrc='/backIcon.svg'
					className='mb-5'
				/>
				<p>No hay productos en la lista de compras.</p>
			</div>
		);
	}

	const crearClienteSiNoExiste = async () => {
		
		const dataToSend = {
			...clientData,
			empresa: empresa ? clientData.empresa : 'Sin empresa', // Asignar valor por defecto a empresa
			nrocasa: clientData.nrocasa || '', // Asegura que los campos opcionales no sean undefined
			ciudad: clientData.ciudad || '',
			provincia: clientData.provincia || '',
			pais: clientData.pais || '',
		};

		try {

			if (!user || !user.role) {
				throw new Error('No hay sesión activa');
			}

			const response = await fetch('/api/addCustomer', {
				method: 'POST',
				headers: {
					'X-User-Role': user.role ? user.role.toString() : '',
					'Content-Type': 'application/json'
    			},
				body: JSON.stringify(dataToSend), // Enviar todos los campos
			});

			if (!response.ok) {
				throw new Error('Error al agregar el cliente.');
			}

			const data = await response.json();
			return data.id;
		} catch (error) {
			console.error('Error al agregar el cliente:', error);
			return null;
		}
	}

	const handleCustomerChange = (e) => {
		const { id, value } = e.target;
		if(value !== ''){
			const selectedOption = allCustomers.find((customer) => customer.id.toString() === value.toString());
			setSelectedCustomer({ [id]: value });
			if(selectedOption.empresa) {
				setEmpresa(true);
			}
			setClientData({ 
				cliente: selectedOption?.cliente || '',
				cedula: selectedOption?.cedula || '',
				telefono: selectedOption?.telefono || '',
				email: selectedOption?.email || '',
				direccion: selectedOption?.direccion || '',
				nrocasa: selectedOption?.nrocasa || '',
				ciudad: selectedOption?.ciudad || '',
				provincia: selectedOption?.provincia || '',
				pais: selectedOption?.pais || '',
				empresa: selectedOption?.empresa || '',
				rif: selectedOption?.rif || '',
			 });
		} else {
			setClientData({ 
				cliente: '',
				cedula: '',
				telefono: '',
				email: '',
				direccion: '',
				nrocasa: '',
				ciudad: '',
				provincia: '',
				pais: '',
				empresa: '',
				rif: '',
			 });
			 setEmpresa(false);
		}
	};
	return (
		<div className={`${styles.container} text-slate-700 dark:text-slate-100 border-1 border-slate-300 dark:border-slate-500 `}>
			<BackButton
				href='/sell-stock/sell'
				text='Volver'
				iconSrc='/backIcon.svg'
				className='mb-5'
			/>
			<h2 className={styles.heading}>Lista de Compras</h2>
			<div className="flex justify-start items-center text-slate-800 dark:text-slate-100 gap-3">
				<label htmlFor='tasa'>Tasa USD/Bs:</label>
				<input
					id='tasa'
					type='number'
					value={tasa}
					className='bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 border-1 border-slate-300 dark:border-slate-500 rounded-md px-2 py-1'
					onChange={handleTasaChange} // Actualiza la tasa con el valor del input
					min='0.01' // Prevenir valores negativos o cero
					step='any' // Permitir decimales
				/>
			</div>
			<div className={styles.gridContainer}>
				<div className={`${styles.gridRow} [&>div]:bg-slate-300 dark:[&>div]:bg-slate-600`}>
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
							<div className={`${styles.gridSubRow} border-l-5 border-slate-400 dark:border-slate-200`} key={sub_index}>
								<div className={styles.gridSubItem}>{asociado.producto}</div>
								<div className={styles.gridSubItem}>{asociado.type}</div>
								<div className={styles.gridItem}>{asociado.cantidadInput}</div>
								<div className={styles.gridItem}>${asociado.precioUnitario}</div>
								<div className={styles.gridItem}>${Number(asociado.cantidadInput) * Number(asociado.precioUnitario)}</div>
								<div className={styles.gridItem} style={{borderRight:'1px solid #ddd'}}>
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
			<hr style={{opacity:'0.2',marginBottom:'20px'}}/>
			<div>
				<h2>Datos del Cliente</h2>
				<label htmlFor='selectedCustomer' className="mr-4">Seleccionar cliente:</label>
				<select
					value={selectedCustomer.id}
					onChange={handleCustomerChange}
					id='selectedCustomer'
					style={{
						width: '100%',
						maxWidth: '313px',
						border: '1px solid #ccc',
						borderRadius: '4px',
						padding: '8px',
						boxSizing: 'border-box',
					}}
				>
					<option value="" className='text-slate-800 dark:text-slate-100 bg-slate-100 dark:bg-slate-700'>Selecciona un cliente</option>
					{allCustomers.map((customer) => (
						<option className='text-slate-800 dark:text-slate-100 bg-slate-100 dark:bg-slate-700' key={customer.id} value={customer.id}>
							{customer.cliente}
						</option>
					))}
				</select>
				<div
				className={styles.form}
			>
				<div className={styles.formGroup}>
					<label htmlFor='cliente'>Nombre del Cliente*:</label>
					<input
						type='text'
						id='cliente'
						value={clientData.cliente}
						onChange={handleChange}
						required
					/>
				</div>
				<div className={styles.formGroup}>
					<label htmlFor='cedula'>Cédula*:</label>
					<input
						type='number'
						id='cedula'
						value={clientData.cedula}
						onChange={(e) => {
							const value = e.target.value;
							if (
								value === '' ||
								(Number(value) <= 99999999 && Number(value) >= 0)
							) {
								handleChange(e);
							}
						}}
						max={99999999}
						required
					/>
				</div>
				<div className={styles.formGroup}>
					<label htmlFor='telefono'>Teléfono:</label>
					<input
						type='text'
						id='telefono'
						value={clientData.telefono}
						onChange={handleChangeTelefono}
						required
						placeholder='(0424)1234567'
					/>
				</div>
				<div className={styles.formGroup}>
					<label htmlFor='email'>Email*:</label>
					<input
						type='email'
						id='email'
						value={clientData.email}
						onChange={handleChange}
						required
					/>
				</div>
				<div className={styles.formGroup}>
					<label htmlFor='direccion'>Dirección:</label>
					<input
						type='text'
						id='direccion'
						value={clientData.direccion}
						onChange={handleChange}
						required
						placeholder='Calle, Avenida, Carretera...'
					/>
				</div>
				<div className={styles.formGroup}>
					<label htmlFor='nrocasa'>Número:</label>
					<input
						type='text'
						id='nrocasa'
						value={clientData.nrocasa}
						onChange={handleChange}
						placeholder='Casa, Apartamento, Local...'
					/>
				</div>
				<div className={styles.formGroup}>
					<label htmlFor='ciudad'>Ciudad:</label>
					<input
						type='text'
						id='ciudad'
						value={clientData.ciudad}
						onChange={handleChange}
						placeholder='Ciudad...'
					/>
				</div>
				<div className={styles.formGroup}>
					<label htmlFor='provincia'>Provincia:</label>
					<input
						type='text'
						id='provincia'
						value={clientData.provincia}
						onChange={handleChange}
						placeholder='Provincia...'
					/>
				</div>
				<div className={styles.formGroup}>
					<label htmlFor='pais'>País:</label>
					<input
						type='text'
						id='pais'
						value={clientData.pais}
						onChange={handleChange}
						placeholder='País...'
					/>
				</div>
				<div className={`${styles.checkBox} flex justify-center items-center`}>
					<input
						type='checkbox'
						id='empresa'
						checked={empresa}
						onChange={() => setEmpresa(!empresa)}
					/>
					<label htmlFor='empresa'>
						¿Tiene empresa?
						<span className={styles.switch}></span>
					</label>
				</div>

				{empresa && (
					<div className={`flex justify-center items-start max-w-[626px] w-full col-span-2 gap-[10px]`}>
						<div className="flex flex-col justify-center items-start w-full">
							<label htmlFor='empresa'>Empresa:</label>
							<input
								type='text'
								id='empresa'
								value={clientData.empresa}
								onChange={handleChange}
								required
								className="w-full p-[10px] border-1 border-[#ddd] rounded-[4px] mt-[10px]"
							/>
						</div>
						<div className="flex flex-col justify-center items-start w-full">
							<label htmlFor='rif'>RIF:</label>
							<input
								type='text'
								id='rif'
								value={clientData.rif}
								onChange={handleChange}
								placeholder='J-12345678'
								className="w-full p-[10px] border-1 border-[#ddd] rounded-[4px] mt-[10px]"
							/>
						</div>
					</div>
				)}
				
			</div>
			</div>
			<hr style={{opacity:'0.3',marginBottom:'20px'}}/>
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
	