import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './NavBar.module.css';

function NavBar() {
	return (
		<div className={styles.navbar}>
			<div className={styles.navContainer}>
				<nav>
					<Link href='/'>
						<Image
							src='/icon.svg'
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
						<Link href='/user'>
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
