'use client';

import { useState } from 'react';
// import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

const ContactCard = ({ name, phone, email }) => {
  return (
    <div className="flex flex-col gap-2.5 border border-gray-300 dark:border-gray-600 p-5 rounded-md bg-white dark:bg-slate-700">
      <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100">{name}</h4>
      <div className="flex items-center gap-2.5">
        <Image
          src='/phoneIcon.svg'
          alt='phone'
          width={25}
          height={25}
          className="opacity-80 dark:invert"
        />
        <span className="opacity-80 text-slate-800 dark:text-slate-100">{phone}</span> 
      </div>
      <div className="flex items-center gap-2.5">
        <Image
          src='/emailIcon.svg'
          alt='email'
          width={25}
          height={25}
          className="opacity-80 dark:invert"
        />
        <span className="opacity-80 text-slate-800 dark:text-slate-100">{email}</span>
      </div>
    </div>
  )
}

export default function Login() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-76px)] bg-gray-100 dark:bg-slate-800 p-5">
      <div className="flex flex-col justify-center items-center gap-5 max-w-[1000px] w-full">
        <div className="text-center max-w-[700px] mx-auto flex flex-col gap-2.5">
          <h2 className="text-[2rem] text-slate-800 dark:text-slate-100">Soporte Técnico</h2>
          <p className="opacity-60 text-slate-800 dark:text-slate-100">
            Si experimentas alguna falla o tienes preguntas sobre nuestro servicio, no dudes en contactar a nuestro equipo de soporte técnico.
          </p>
        </div>
        <div className="flex justify-center items-start w-[90%]">
          <div className="w-full grid grid-cols-2 gap-5">
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
