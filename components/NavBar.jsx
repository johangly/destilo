"use client"
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './NavBar.module.css';
import { useAuth } from '@/context/AuthContext';

function NavBar() {
	const { user,loading } = useAuth();
	console.log('user desde el navbar',user)
	const [username, setUsername] = useState('');
	useEffect(() => {
		if(user){
			setUsername(user.username);
		}
	}, [user]);
	return (
		<div className={styles.navbar}>
			<div className={styles.navContainer}>
				<nav>
					<Link href='/'>
						<Image
							src='/navbar-icon.svg'
							alt='logo'
							width={150}
							height={40}
						/>
					</Link>
					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
						}}
					>
						{!username && loading === false && (
							<Link
							href='/about'
							style={{
								display: 'flex',
								flexDirection: 'row',
								alignItems: 'center',
								marginRight: '1rem',
								fontSize: '1.2rem',
								fontWeight: 'bold',
							}}
						>
							{' '}
							👀 Quienes somos?
						</Link>
						)}
						<Link
							href='/user'
							style={{
								display: 'flex',
								flexDirection: 'row',
								alignItems: 'center',
								gap: '0.5rem',
							}}
						>
							<span>{username}</span>
							<Image
								src='https://cdn-icons-png.flaticon.com/512/456/456212.png'
								alt='user'
								width={30}
								height={30}
							/>
						</Link>
					</div>
				</nav>
			</div>
		</div>
	);
}

export default NavBar;
