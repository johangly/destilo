'use client';

import { useState } from 'react';
// import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';
import Image from 'next/image';

const ContactCard = ({ name, phone, email }) => {
  return (
    <div style={{display:'flex',flexDirection:'column',gap:'10px',border:'1px solid #ccc', padding:'20px', width:'100%',borderRadius:'10px'}}>
      <h4 style={{fontWeight:'600', fontSize:'1.1rem'}}>{name}</h4>
      <div style={{display:'flex',justifyContent:'start',alignItems:'center', gap:'10px'}}>
        <Image
          src='/phoneIcon.svg'
          alt='phone'
          width={25}
          height={25}
		  style={{opacity:'0.8'}}
        />
        <span style={{opacity:'0.8'}}>{phone}</span> 
      </div>
      <div style={{display:'flex',justifyContent:'start',alignItems:'center', gap:'10px'}}>
        <Image
          src='/emailIcon.svg'
          alt='email'
          width={25}
          height={25}
		  style={{opacity:'0.8'}}
        />
        <span style={{opacity:'0.8'}}>{email}</span>
      </div>
    </div>
  )
}

export default function Login() {
  return (
    <div className={styles.container}>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '20px',maxWidth: '1000px', width:'100%' }}>
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto',display:'flex',flexDirection:'column',gap:'10px' }}>
          <h2 style={{fontSize:'2rem'}}>Soporte Técnico</h2>
          <p style={{opacity:'0.6'}}>Si experimentas alguna falla o tienes preguntas sobre nuestro servicio, no dudes en contactar a nuestro equipo de soporte técnico.
          </p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'start', width:'90%' }}>
          {/* <div style={{width:'40%', padding:'20px',display:'flex',flexDirection:'column',gap:'10px'}}>
            <h3>Equipo de Soporte</h3>
            <p style={{opacity:'0.6'}}>Contacta directamente a nuestros especialistas</p>
          </div> */}
          <div style={{width:'100%', display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:'20px'}}>
			<ContactCard 
				name="Argenis Lozada"
				phone="0424-7307390"
				email="argenislozada10@gmail.com"
			/>
			<ContactCard 
				name="Ananyeli García"
				phone="0424-8026715"
				email="garciaananyeli0@gmail.com"
			/>
			<ContactCard 
				name="Luz Evans"
				phone="0424-8025036"
				email="luzevans2005@gmail.com"
			/>
			<ContactCard 
				name="Francisca Almeida"
				phone="0412-4847945"
				email="almeidadominguezf@gmail.com"
			/>
		  </div>
        </div>
      </div>
    </div>
  );
}
