'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { HomeIcon } from '@/components/Icons';
import { useAuth } from '@/context/AuthContext';
import styles from '../page.module.css';

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
                    {productos.map((producto,index) => (
                        <tr key={index}>
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
