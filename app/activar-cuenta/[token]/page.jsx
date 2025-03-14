'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';
import Link from 'next/link';
import React from 'react';

function ActivateAccount({ params }) {
	const { token } = React.use(params);
	const [checkingToken,setCheckingToken] = useState(true)
	const [isValidToken,setIsValidToken] = useState(false)

	async function verificarToken(token) {
		try {
	
			const response = await fetch('/api/checkValidateToken', {
				method: 'GET',
				headers: {
					'X-User-Token': token ? token.toString() : '',
					'Content-Type': 'application/json'
				},
			});
	
			if (!response.ok) throw new Error('Error al verificar el token');
			const { data } = await response.json();
			setIsValidToken(true);
			setCheckingToken(false);
			return data;
		} catch (error) {
			console.error('Error al verificar el token:', error);
			setCheckingToken(false);
		}	
	}

	useEffect(() => {
			verificarToken(token)
	}, []);
	
	return (
		<div className={styles.container}>
			{checkingToken && 
				<div style={{display:'flex',justifyContent:'center',alignItems:'center',gap:'1rem',flexDirection:'column'}}>
					<span style={{fontSize:'1.4rem'}}>Verificando token...</span>
					<small>Por favor espere</small>
				</div>
			}
			{isValidToken &&
				<div style={{display:'flex',justifyContent:'center',alignItems:'center',gap:'1rem',flexDirection:'column',border:'1px solid #5cb85c', borderRadius:'20px',padding:'20px',backgroundColor:'#bee3be'}}>
					<span style={{fontSize:'1.4rem',color:'#2e5c2e',fontWeight:'bold'}}>Su cuenta ha sido activada con exito!</span>
					<p style={{textAlign:'center',color:'#2e5c2e'}}>Ya puede usar sus credenciales para ingresar a la plataforma mediante el <Link href='/' className={styles.link} style={{color:'#0000ff'}}>Formulario de inicio de sesion!</Link></p>
				</div>
			}
		</div>
	);
}

export default ActivateAccount;
