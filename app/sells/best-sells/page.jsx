'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import styles from '../page.module.css';
import BackButton from '@/components/BackButton';
import PrintHeader from '@/components/PrintHeader';

function BestSells() {
    const [productos, setProductos] = useState([]);
    const { user } = useAuth();

    const obtenerProductosMasVendidos = async () => {
        try {
            if (!user || !user.role) {
                throw new Error('No hay sesión activa');
            }

            const response = await fetch('/api/getBestSells', {
                method: 'GET',
                headers: {
                    'X-User-Role': user.role.toString(),
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error('Error al obtener los productos');
            const { datos } = await response.json();
            console.log('bestSells',datos)
            setProductos(datos);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        if (user) {
            obtenerProductosMasVendidos();
        }
    }, [user]);

    return (
        <div className={`${styles.container} bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 border-1 border-slate-300 dark:border-slate-500`}>

            <BackButton
                    href='/sells'
                    text='Volver'
                    iconSrc='/backIcon.svg'
                />
            <PrintHeader />
            <h1 className={styles.heading}>Productos Más Vendidos</h1>
            <div className={styles.hideOnPrint}>
                <button style={{ padding: '8px 12px', backgroundColor: '#2196f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', transition: 'background-color 0.3s ease' }} onClick={() => {window.print()}}>Imprimir Reporte</button>
            </div>
            <table className={styles.table}>
                <thead>
                    <tr className='bg-slate-400 dark:bg-slate-600 text-slate-800 dark:text-slate-100 border-1 border-slate-300 dark:border-slate-500 [&>th]:border-1 [&>th]:border-slate-300 dark:[&>th]:border-slate-500'>
                        <th>ID del Producto</th>
                        <th>Nombre del Producto</th>
                        <th>Cantidad Vendida</th>
                        <th>Precio Unitario</th>
                        <th>Total Vendido</th>
                    </tr>
                </thead>
                <tbody>
                    {productos.map((producto,index) => (
                        <tr className='text-slate-800 dark:text-slate-100 border-1 border-slate-300 dark:border-slate-500 [&>td]:border-1 [&>td]:border-slate-300 dark:[&>td]:border-slate-500' key={index}>
                            <td>{producto.producto_id}</td>
                            <td>{producto.nombre}</td>
                            <td>{producto.totalVendido}</td>
                            <td>{producto.precioUnitario}</td>
                            <td>${Number(producto.totalVendido) * Number(producto.precioUnitario)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default BestSells;
