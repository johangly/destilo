// /context/sellsContext.js
'use client';

import React, { createContext, useContext, useState } from 'react';

// Crear el contexto
const ListaComprasContext = createContext();

// Proveedor del contexto
export const ListaComprasProvider = ({ children }) => {
	const [listaCompras, setListaCompras] = useState([]);

	// Agregar un producto a la lista
	const agregarProducto = (producto) => {
		setListaCompras((prevLista) => [...prevLista, producto]);
	};

	// Eliminar un producto de la lista
	const eliminarProducto = (index) => {
		setListaCompras((prevLista) => prevLista.filter((_, i) => i !== index));
	};

	// Limpiar la lista completa
	const limpiarLista = () => {
		setListaCompras([]);
	};

	return (
		<ListaComprasContext.Provider
			value={{ listaCompras, agregarProducto, eliminarProducto, limpiarLista }}
		>
			{children}
		</ListaComprasContext.Provider>
	);
};

// Hook para usar el contexto
export const useListaCompras = () => {
	const context = useContext(ListaComprasContext);
	if (!context) {
		throw new Error(
			'useListaCompras debe estar dentro de ListaComprasProvider'
		);
	}
	return context;
};
