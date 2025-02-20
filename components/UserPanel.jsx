import React from 'react';
import Link from 'next/link';
import styles from './UserPanel.module.css';
import {
	Sell,
	Productos,
	Clients,
	Suppliers,
	Inventory,
	Services,
} from './Icons';

function UserPanel() {
	return (
		<div className={styles.userPanel}>
			<Link href='/sells'>
				<Sell />
				Facturación
			</Link>
			<Link href='/products'>
				<Productos />
				Productos
			</Link>
			<Link href='/customers'>
				<Clients /> Clientes
			</Link>
			<Link href='/services'>
				<Services /> Servicios
			</Link>
			<Link href='/suppliers'>
				<Suppliers /> Proveedores
			</Link>
			<Link href='/sell-stock/stock'>
				<Inventory />
				Inventario
			</Link>
		</div>
	);
}

export default UserPanel;
