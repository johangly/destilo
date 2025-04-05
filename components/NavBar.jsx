"use client"
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import styles from './NavBar.module.css'
function NavBar() {
	const { user,loading } = useAuth();
	const [username, setUsername] = useState('');
	const [theme, setTheme] = useState('light');
	const handleThemeChange = () => {
		
		setTheme(theme === 'light' ? 'dark' : 'light');
		// localStorage.setItem('theme', theme === 'light' ? 'dark' : 'light');
	};
	useEffect(() => {

		
		if(user){
			setUsername(user.username);
		}

		if(document && window){
			if(theme === 'dark'){
				document.querySelector('html').classList.add('dark');
			}else{
				document.querySelector('html').classList.remove('dark');
				
			}
		} 

	}, [user,theme]);
	return (
		<div className="flex flex-row justify-center items-center p-4 px-8 bg-gray-50 dark:bg-slate-700 shadow-md w-full hideOnPrint">
			<div className="flex min-w-[1200px]">
				<nav className="flex flex-row justify-between items-center w-full px-4">
					<Link href='/'>
						<Image
							src='/logo-group-1.svg'
							alt='logo'
							width={150}
							height={40}
							className="dark:hidden block"
						/>
						<Image
							src='/stockvenLigth.svg'
							alt='logo'
							width={150}
							height={40}
							className="hidden dark:block"
						/>
					</Link>
					<div className="ml-auto mr-5">
						<label className={styles.switch}>
							<input type="checkbox" onChange={()=>{handleThemeChange()}} />
							<span className={styles.slider}></span>
						</label>
					</div>
					<div className="flex flex-row items-center">
						{!username && loading === false && (
							<Link
								href='/about'
								className="flex flex-row items-center mr-4 text-xl font-bold dark:text-white"
							>
								{' '}
								👀 Quienes somos?
							</Link>
						)}
						{username && 
							<Link
								href='/user'
								className="flex flex-row items-center gap-2 dark:text-white"
							>	
								<span>{username}</span>
								<Image
									src='https://cdn-icons-png.flaticon.com/512/456/456212.png'
									alt='user'
									width={30}
									height={30}
									className="dark:invert"
								/>
							</Link>
						}
					</div>
				</nav>
			</div>
		</div>
	);
}

export default NavBar;
