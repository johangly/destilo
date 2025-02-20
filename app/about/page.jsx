import React from 'react';
import styles from './page.module.css';
import Link from 'next/link';
import { HomeIcon } from '@/components/Icons';

const AboutUs = () => {
	return (
		<section className={styles.aboutUs}>
			<Link
				href='/home'
				style={{
					display: 'flex',
					alignItems: 'center',
					marginBottom: '30px',
					width: '100%',
					justifyContent: 'flex-start',
				}}
			>
				<HomeIcon /> <p style={{ marginLeft: '10px' }}>Ir a inicio</p>
			</Link>
			<h2 className={styles.sectionTitle}>Sobre D’Estilo Plus</h2>

			<div className={styles.content}>
				<div className={styles.companyInfo}>
					<h3 className={styles.subheading}>¿A qué nos dedicamos?</h3>
					<p>
						D’Estilo Plus es una empresa ubicada en la ciudad de El Tigre,
						Estado Anzoátegui, dedicada a la venta y suministración de productos
						y artículos relacionados con la sublimación. Ofrecemos una amplia
						variedad de artículos personalizados como franelas, tazas, gorras, y
						más, siempre con un enfoque en satisfacer las necesidades tanto del
						sector público como privado. Nuestro objetivo es contribuir al
						desarrollo económico local a través de la calidad y personalización
						de nuestros productos.
					</p>
				</div>

				<div className={styles.mission}>
					<h3 className={styles.subheading}>Misión</h3>
					<p>
						Nuestra misión en D’Estilo Plus es suministrar artículos
						personalizados mediante el proceso de sublimación, a través de un
						modelo de negocio que abarca tanto la compra-venta pública como
						privada. Nos comprometemos a ofrecer productos de alta calidad,
						siempre con un enfoque ético y correcto hacia nuestros clientes,
						garantizando su satisfacción y contribuyendo al bienestar de la
						comunidad.
					</p>
				</div>

				<div className={styles.vision}>
					<h3 className={styles.subheading}>Visión</h3>
					<p>
						La visión de D’Estilo Plus es expandir su presencia en el mercado
						mediante la implementación de nuevas herramientas tecnológicas y
						técnicas. Aspiramos a consolidarnos como uno de los negocios líderes
						en el ámbito de la sublimación, destacándonos por nuestra atención
						al cliente, liderazgo, integridad y excelencia en todos nuestros
						procesos.
					</p>
				</div>
			</div>
		</section>
	);
};

export default AboutUs;
