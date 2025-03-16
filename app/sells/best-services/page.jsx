'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { HomeIcon } from '@/components/Icons';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/apiClient';
import styles from '../page.module.css';

function BestServices() {
    const [servicios, setServicios] = useState([]);
    const { user } = useAuth();

    const obtenerServiciosMasVendidos = async () => {
        try {
            if (!user || !user.role) {
                throw new Error('No hay sesión activa');
            }
            const { datos } = await api.getBestServices(user.role);
            console.log('bestServices',datos)
            setServicios(datos);
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
            <div className={styles.hideOnPrint}>
                <Link href='/sells' style={{ display: 'flex', alignItems: 'center' }}>
                    <HomeIcon /> <p style={{ marginLeft: '5px' }}>Volver a Ventas</p>
                </Link>
            </div>
            <h1 className={styles.heading}>Productos Más Vendidos</h1>
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
