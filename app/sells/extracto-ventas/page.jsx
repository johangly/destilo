'use client';

import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import styles from './page.module.css';
import { useAuth } from '@/context/AuthContext';
import BackButton from '@/components/BackButton';

function VentasFiltradas() {
	const [ventas, setVentas] = useState([]); // Estado para todas las ventas
	const [ventasFiltradas, setVentasFiltradas] = useState([]); // Estado para las ventas filtradas
	const [fechaInicio, setFechaInicio] = useState('');
	const [fechaFin, setFechaFin] = useState('');
	const { user,loading } = useAuth();

	// Obtener todas las ventas desde Firebase
	const obtenerVentas = async () => {
		try {
			if (!user || !user.role) {
				throw new Error('No hay sesión activa');
			}

			const response = await fetch('/api/getSellsData', {
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
			console.error('Error al obtener ventas:', error);
		}
	};

	useEffect(() => {
		if(user){
			obtenerVentas();
		}
	}, [user]);

	// Filtrar ventas según el rango de fechas
	const filtrarVentas = () => {
		if (!fechaInicio || !fechaFin) return; // No hace nada si no hay fechas seleccionadas

		const inicio = new Date(fechaInicio);
		let fin = new Date(fechaFin);

		// Sumamos un día a la fecha de fin para incluir todo el día seleccionado
		fin.setDate(fin.getDate() + 1);
		fin.setHours(23, 59, 59, 999); // Esto ajusta el final del día al último momento posible

		// Filtrar ventas que estén dentro del rango
		const ventasFiltradas = ventas.filter((venta) => {
			const fechaVenta = new Date(venta.fecha);

			// Comparar solo las fechas sin tomar en cuenta la hora
			return fechaVenta >= inicio && fechaVenta <= fin;
		});

		setVentasFiltradas(ventasFiltradas);
	};

	// Calcular el total general de todas las ventas filtradas
	const calcularTotalGeneral = () => {
		return ventasFiltradas.reduce((acc, venta) => {
			return (
				acc +
				venta.items.reduce((acc2, p) => {
					// Aseguramos que precioTotal sea un número antes de sumarlo
					const precioTotal = Number(p.precioTotal);
					return acc2 + (isNaN(precioTotal) ? 0 : precioTotal);
				}, 0)
			);
		}, 0);
	};

	// Función para generar el PDF
	const generarPDF = () => {
		const doc = new jsPDF();

		doc.setFontSize(16);
		doc.text('Extracto de Ventas', 20, 20);

		let yPosition = 30;

		// Encabezado de la tabla
		doc.setFontSize(12);
		doc.text('ID Factura', 20, yPosition);
		doc.text('Fecha', 60, yPosition);
		doc.text('Total', 120, yPosition);
		yPosition += 10;

		// Agregar las ventas filtradas a la tabla
		ventasFiltradas.forEach((venta) => {
			doc.text(venta.id_factura.toString(), 20, yPosition);
			doc.text(new Date(venta.fecha).toLocaleDateString(), 60, yPosition);
			doc.text(
				venta.items
					.reduce((acc, p) => acc + (Number(p.precioTotal) || 0), 0)
					.toFixed(2),
				120,
				yPosition
			);
			yPosition += 10;
		});

		// Total General
		doc.setFontSize(14);
		doc.text(
			`Total General: $${calcularTotalGeneral().toFixed(2)}`,
			20,
			yPosition + 10
		);

		// Descargar el PDF
		doc.save('extracto_ventas.pdf');
	};

	return (
		<div className={`${styles.container} bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 border-1 border-slate-300 dark:border-slate-500`}>
			<BackButton
				href='/home'
				text='Volver'
				iconSrc='/backIcon.svg'
			/>
			<h2 className={styles.heading}>Filtrar Ventas por Fecha</h2>
			<div className={`${styles.filters} flex justify-center items-center`}>
				<label>Fecha Inicio:</label>
				<input
					type='date'
					value={fechaInicio}
					onChange={(e) => setFechaInicio(e.target.value)}
					className='bg-slate-100 text-slate-800 border-1 border-slate-500'
				/>
				<label>Fecha Fin:</label>
				<input
					type='date'
					value={fechaFin}
					className='bg-slate-100 text-slate-800 border-1 border-slate-500'
					onChange={(e) => setFechaFin(e.target.value)}
				/>
				<button
					className={styles.actionButton}
					onClick={filtrarVentas}
				>
					Filtrar
				</button>
				<button
					className={styles.actionButton}
					onClick={generarPDF}
				>
					Descargar PDF
				</button>
			</div>

			<table className={`${styles.table}`}>
				<thead className="bg-slate-400 dark:bg-slate-600 text-slate-800 dark:text-slate-100 border-1 border-slate-300 dark:border-slate-500">
					<tr className='[&>th]:border-1 [&>th]:border-slate-300 dark:[&>th]:border-slate-500'>
						<th>ID Factura</th>
						<th>Fecha</th>
						<th>Productos</th>
						<th>Total</th>
					</tr>
				</thead>
				<tbody>
					{ventasFiltradas.length > 0 ? (
						ventasFiltradas.map((venta) => (
							<tr
								className='[&>td]:border-1 [&>td]:border-slate-300 dark:[&>td]:border-slate-500'
								key={venta.id_factura}>
								<td>{venta.id_factura}</td>
								<td>{new Date(venta.fecha).toLocaleDateString()}</td>
								<td>
									<ul>
										{venta.items.map((p, index) => (
											<li key={index}>
												{p.nombre} (x{p.cantidad}) - ${p.precioUnitario}
											</li>
										))}
									</ul>
								</td>
								<td>
									$
									{venta.items
										.reduce((acc, p) => {
											// Aseguramos que precioTotal sea un número válido
											const precioTotal = Number(p.precioTotal);
											return acc + (isNaN(precioTotal) ? 0 : precioTotal);
										}, 0)
										.toFixed(2)}
								</td>
							</tr>
						))
					) : (
						<tr>
							<td colSpan='4'>No hay ventas en el periodo seleccionado</td>
						</tr>
					)}
				</tbody>
			</table>

			{ventasFiltradas.length > 0 && (
				<div className={styles.totalGeneral}>
					<h3>Total General: ${calcularTotalGeneral().toFixed(2)}</h3>
				</div>
			)}
		</div>
	);
}

export default VentasFiltradas;
