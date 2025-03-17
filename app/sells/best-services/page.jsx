'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import styles from '../page.module.css';
import BackButton from '@/components/BackButton';
import PrintHeader from '@/components/PrintHeader';

function BestServices() {
    const [servicios, setServicios] = useState([]);
    const { user } = useAuth();

    const obtenerServiciosMasVendidos = async () => {
        try {
            if (!user || !user.role) {
                throw new Error('No hay sesión activa');
            }

            const response = await fetch('/api/getBestServices', {
                method: 'GET',
                headers: {
                    'X-User-Role': user.role.toString(),
                    'Content-Type': 'application/json'
                }
            });
            
            const { datos } = await response.json();
            console.log('bestServices',datos)
            if(!datos){
                setServicios([]);
            } else {
                setServicios(datos);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        if (user) {
            obtenerServiciosMasVendidos();
        }
    }, [user]);

    return (
        <div className={styles.container}>
             <BackButton
                    href='/sells'
                    text='Volver'
                    iconSrc='/backIcon.svg'
                />
            <PrintHeader />
            <h1 className={styles.heading}>Servicios Más Vendidos</h1>
            <div className={styles.hideOnPrint}>
                <button style={{ padding: '8px 12px', backgroundColor: '#2196f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', transition: 'background-color 0.3s ease' }} onClick={() => {window.print()}}>Imprimir Reporte</button>
            </div>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>ID del Producto</th>
                        <th>Nombre del Producto</th>
                        <th>Cantidad Vendida</th>
                        <th>Precio Unitario</th>
                        <th>Total Vendido</th>
                    </tr>
                </thead>
                <tbody>
                    {servicios.map((servicio,index) => (
                        <tr key={index}>
                            <td>{servicio.service_id}</td>
                            <td>{servicio.nombre}</td>
                            <td>{servicio.totalVendido}</td>
                            <td>{servicio.precioUnitario}</td>
                            <td>${Number(servicio.totalVendido) * Number(servicio.precioUnitario)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default BestServices;
