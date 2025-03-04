"use client"
import React from 'react';
import Link from 'next/link';
import styles from './UserPanel.module.css';
import Image from 'next/image';
import {
	Sell,
	Productos,
	Clients,
	Suppliers,
	Inventory,
	Services,
} from './Icons';
import { useAuth } from '@/context/AuthContext';


function UserPanel() {

	const { user,loading } = useAuth();

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
			{user?.role === "admin" && (
				<Link href='/users'>
					<Image
						src='/users_icon.png'
						alt='user'
						width={30}
						height={30}
						style={{filter:'invert(100%)'}}
					/>
					Usuarios
				</Link>
			)}
		</div>
	);
}

export default UserPanel;
