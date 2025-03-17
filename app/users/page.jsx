'use client';

import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import Link from 'next/link';
import { DeleteIcon } from '@/components/Icons';
import { useAuth } from '@/context/AuthContext';
import BackButton from '@/components/BackButton';

function ListaClientes() {
	const [users, setUsers] = useState([]); // Clientes filtrados
	const [allUsers, setAllUsers] = useState([]); // Todos los clientes
	const [message, setMessage] = useState(null);
	const { user,loading } = useAuth();

	// Obtener clientes desde Firebase
	const getUsers = async () => {
		try {
			if (!user || !user.role) {
				throw new Error('No hay sesión activa');
			}

			const response = await fetch('/api/getUsers', {
				method: 'GET',
				headers: {
					'X-User-Role': user.role ? user.role.toString() : '',
					'Content-Type': 'application/json'
    			}
			});

			if (!response.ok) throw new Error('Error al obtener los usuarios');
			const data = await response.json();
			console.log("getUsers:",data)
			const newUsers = data.filter((newUser) => Number(newUser.id) !== Number(user.id));
			setUsers(newUsers);
			setAllUsers(newUsers);
		} catch (error) {
			console.error(error.message);
			setMessage('Error al cargar los usuarios.');
		}
	};

	const deleteUser = async (id) => {
		if (!window.confirm('¿Estás seguro de que deseas eliminar este usuario?'))
			return;

		try {
			if (!user || !user.role) {
				throw new Error('No hay sesión activa');
			}

			const response = await fetch('/api/deleteUser', {
				method: 'DELETE',
				headers: {
					'X-User-Role': user.role ? user.role.toString() : '',
					'Content-Type': 'application/json'
    			},
				body: JSON.stringify({ id }),
			});

			if (!response.ok) throw new Error('Error al eliminar el usuario');

			setUsers((prev) => prev.filter((user) => user.id !== id));
			setAllUsers((prev) => prev.filter((user) => user.id !== id)); // Asegurar que se elimine de ambos estados
			setMessage('Usuario eliminado con éxito.');
		} catch (error) {
			console.error(error.message);
			setMessage('Error al eliminar el usuario.');
		}
	};

	useEffect(() => {
		if(user){
			getUsers();
		}
	}, [user]);

	const handleSearch = (e) => {
		const searchValue = e.target.value.trim().toLowerCase(); // Convertir a minúsculas

		if (searchValue === '') {
			setUsers(allUsers);
			return;
		}

		const filteredUsers = allUsers.filter((user) => {
			const username = user.username?.toLowerCase() || '';

			return (
				username.includes(searchValue)
			);
		});

		setUsers(filteredUsers);
	};

	return (
		<div className={styles.customersContainer}>
			<BackButton
				href='/home'
				text='Volver'
				iconSrc='/backIcon.svg'
			/>
			<h1 className={styles.title}>Lista de Usuarios</h1>

			<div className={styles.searchContainer}>
				<label className={styles.searchLabel}>
					<strong>Buscar:</strong>
				</label>
				<input
					type='text'
					placeholder='Nombre'
					className={styles.searchInput}
					onChange={handleSearch}
				/>
			</div>

			<Link
				href='/users/addUser'
				style={{
					marginTop: '1rem',
					marginBottom: '1rem',
					display: 'block',
					textAlign: 'center',
					color: '#1a73e8',
				}}
			>
				Crear Usuario
			</Link>

			{message && <p className={styles.message}>{message}</p>}

			<div className={styles.cardsContainer}>
				{users.length > 0 ? (
					users.map((user) => (
						<div
							key={user.id}
							className={styles.customerCard}
						>
							{/* <h2 className={styles.customerName}>{user.username}</h2> */}
							<p className={styles.detail}>
								<strong>Nombre de usuario:</strong> {user.username}
							</p>
							<p className={styles.detail}>
								<strong>Correo Electronico:</strong> {user.email}
							</p>
							<p className={styles.detail}>
								<strong>Rol:</strong> {user.role}
							</p>
							<div style={{ display: 'flex', gap: '10px' }}>
								<button
									className={styles.deleteButton}
									onClick={() => deleteUser(user.id)}
								>
									<DeleteIcon />
								</button>
								{/* <button
									className={styles.deleteButton}
									onClick={() => editUser(user.id)}
								>
									<EditIcon />
								</button> */}
							</div>
						</div>
					))
				) : (
					<p className={styles.message}>No se encontraron usuarios.</p>
				)}
			</div>
		</div>
	);
}

export default ListaClientes;
