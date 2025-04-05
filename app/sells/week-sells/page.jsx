'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import styles from '../page.module.css';
import BackButton from '@/components/BackButton';
import PrintHeader from '@/components/PrintHeader';

function WeekSells() {
    const [sells, setSells] = useState([]);
    const { user } = useAuth();

    const obtenerVentasDeLaSemana = async () => {
        try {
            if (!user || !user.role) {
                throw new Error('No hay sesión activa');
            }

            const response = await fetch('/api/getWeekSells', {
                method: 'GET',
                headers: {
                    'X-User-Role': user.role.toString(),
                    'Content-Type': 'application/json'
                }
            });
            // if (!response.ok) throw new Error('Error al obtener las ventas de la semana');
            console.log(response)
            const {datos} = await response.json();
            console.log(datos)
            if(!datos){
                setSells([]);
            }else{
                setSells(datos);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const calcularMontoTotal = (productos) => {
        if (!Array.isArray(productos)) return 0;
        return productos.reduce((total, producto) => {
            if (producto.type === 'stock') {
                return parseFloat(total) + parseFloat(producto.precioTotal);
            } else if (producto.type === 'service') {
                if (!producto.items || producto.items.length === 0) {
                    return total;
                }
                const totalItems = producto.items.reduce((subTotal, item) => parseFloat(subTotal) + parseFloat(item.precioTotal), 0);
                return parseFloat(total) + parseFloat(totalItems) + parseFloat(producto.precioTotal);
            }
            return total;
        }, 0);
    };

    useEffect(() => {
        if (user) {
            obtenerVentasDeLaSemana();
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
            <h1 className={styles.heading}>Ventas de la Semana</h1>
            <div className={styles.hideOnPrint}>
                <button style={{ padding: '8px 12px', backgroundColor: '#2196f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', transition: 'background-color 0.3s ease' }} onClick={() => {window.print()}}>Imprimir Reporte</button>
            </div>
            <table className={styles.table}>
                <thead>
                    <tr className='bg-slate-400 dark:bg-slate-600 text-slate-800 dark:text-slate-100 border-1 border-slate-300 dark:border-slate-500 [&>th]:border-1 [&>th]:border-slate-300 dark:[&>th]:border-slate-500'>
                        <th>ID de la Compra</th>
                        <th>Cliente</th>
                        <th>Monto Total</th>
                        <th>Fecha</th>
                    </tr>
                </thead>
                <tbody>
                    {sells.map((sell) => {
						const fechaFormateada = new Date(sell.fecha).toLocaleString();

                        return(
                            <tr key={sell.id} className='text-slate-800 dark:text-slate-100 border-1 border-slate-300 dark:border-slate-500 [&>td]:border-1 [&>td]:border-slate-300 dark:[&>td]:border-slate-500'>
                            <td>{sell.id_factura}</td>
                            <td>{sell.customer.cliente}</td>
                            <td>${calcularMontoTotal(sell.items).toFixed(2)}</td>
                            <td>{fechaFormateada}</td>
                        </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default WeekSells;
