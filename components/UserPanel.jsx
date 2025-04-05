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
		<div className="text-slate-100 flex flex-col gap-4 bg-slate-700 w-full max-w-[300px] px-10 py-10 min-h-[700px] border-t-4 border-slate-600 rounded-xl">
			<Link className="flex gap-4 text-lg text-slate-100 dark:text-slate-100 items-center justify-start" href='/sells'>
				<Sell className="w-13 h-13"/>
				Facturación
			</Link>
			<Link className="flex gap-4 text-lg text-slate-100 dark:text-slate-100 items-center justify-start" href='/products'>
				<Productos className="w-13 h-13"/>
				Productos
			</Link>
			<Link className="flex gap-4 text-lg text-slate-100 dark:text-slate-100 items-center justify-start" href='/customers'>
				<Clients className="w-13 h-13"/> Clientes
			</Link>
			<Link className="flex gap-4 text-lg text-slate-100 dark:text-slate-100 items-center justify-start" href='/services'>
				<Services className="w-13 h-13"/> Servicios
			</Link>
			<Link className="flex gap-4 text-lg text-slate-100 dark:text-slate-100 items-center justify-start" href='/suppliers'>
				<Suppliers className="w-13 h-13"/> Proveedores
			</Link>
			<Link className="flex gap-4 text-lg text-slate-100 dark:text-slate-100 items-center justify-start" href='/sell-stock/stock'>
				<Inventory className="w-13 h-13"/>
				Inventario
			</Link>
			{user?.role === "admin" && (
				<Link className="flex gap-4 text-lg text-slate-100 dark:text-slate-100 items-center justify-start" href='/users'>
					<Image
						src='/users_icon.svg'
						alt='user'
						width={30}
						height={30}
						style={{filter:'invert(100%)'}}
					className="w-13 h-13"/>
					Usuarios
				</Link>
			)}
		</div>
	);
}

export default UserPanel;
