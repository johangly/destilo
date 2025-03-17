"use client"
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

const PrintHeader = () => {
    const [fechaActual, setFechaActual] = useState('');

    useEffect(() => {
        setFechaActual(new Date().toLocaleString());
    }, []);

    return (
        <div className="showOnPrint" style={{justifyContent:'space-between',alignItems:'center',marginBottom:'20px'}}>
            <Image
                src='/navbar-icon.svg'
                alt='Logo'
                width={180}
                height={50}
            />
            <p>
            Fecha: {fechaActual}
            </p>
        </div>
    );
};

export default PrintHeader;
