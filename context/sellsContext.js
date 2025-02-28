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
	const eliminarProducto = (index=null,sub_index=null) => {

		// al ser suministrados ambos indices, indica que se esta eliminando un producto que sta dentro de un servicio.
		console.log('index:',index,'sub_index:',sub_index)
		// console.log(index!=null && sub_index!=null)
		if(index!=null && sub_index!=null){
			console.log('listaCompras desde eliminar producto:',listaCompras)
			setListaCompras((prevLista) => {
				console.log('lista de compra con prevState',prevLista)
				const updatedLista = [...prevLista];
				const item = updatedLista[index].productosAsociado.splice(sub_index, 1);
				updatedLista[index] = updatedLista[index];
				return updatedLista;
			});
		} else {
			setListaCompras((prevLista) => prevLista.filter((_, i) => i !== index));
		}
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
