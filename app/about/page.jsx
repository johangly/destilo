import React from 'react';
import BackButton from '@/components/BackButton';
import Container from '@/components/Container';

const InfoCard = ({ title, children }) => (
  <div className="overflow-hidden relative bg-white dark:bg-slate-700 p-5 rounded-lg shadow
    after:absolute after:w-[110%] after:top-0 after:bg-blue-500 after:h-2 after:left-1/2 after:-translate-x-1/2 after:rounded">
    <h3 className="text-2xl text-blue-700 dark:text-blue-400 mt-5 font-bold font-arial">{title}</h3>
    <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed font-arial">
      {children}
    </p>
  </div>
);

const AboutUs = () => {
	return (
		<Container>
			<section className="flex flex-col items-center text-center p-10 px-5 rounded-lg max-w-[1200px]">
			<BackButton
				href='/sells'
				text='Volver'
				iconSrc='/backIcon.svg'
				className="mb-5"
			/>
			<h2 className="text-5xl font-bold text-slate-800 dark:text-slate-100 text-center relative mb-8 font-arial after:absolute after:w-full after:-bottom-5 after:bg-blue-500 after:h-2 after:left-0 after:rounded">Sobre D'Estilo Plus</h2>
			<p className="text-slate-800 dark:text-slate-100 mb-6 max-w-xl text-lg">Expertos en sublimación y productos personalizados de alta calidad desde El Tigre, Estado Anzoátegui.</p>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">
				<InfoCard title="¿A qué nos dedicamos?">
					D'Estilo Plus es una empresa ubicada en la ciudad de El Tigre,
					Estado Anzoátegui, dedicada a la venta y suministración de productos
					y artículos relacionados con la sublimación. Ofrecemos una amplia
					variedad de artículos personalizados como franelas, tazas, gorras, y
					más, siempre con un enfoque en satisfacer las necesidades tanto del
					sector público como privado. Nuestro objetivo es contribuir al
					desarrollo económico local a través de la calidad y personalización
					de nuestros productos.
				</InfoCard>

				<InfoCard title="Misión">
					Nuestra misión en D'Estilo Plus es suministrar artículos
					personalizados mediante el proceso de sublimación, a través de un
					modelo de negocio que abarca tanto la compra-venta pública como
					privada. Nos comprometemos a ofrecer productos de alta calidad,
					siempre con un enfoque ético y correcto hacia nuestros clientes,
					garantizando su satisfacción y contribuyendo al bienestar de la
					comunidad.
				</InfoCard>

				<InfoCard title="Visión">
					La visión de D'Estilo Plus es expandir su presencia en el mercado
					mediante la implementación de nuevas herramientas tecnológicas y
					técnicas. Aspiramos a consolidarnos como uno de los negocios líderes
					en el ámbito de la sublimación, destacándonos por nuestra atención
					al cliente, liderazgo, integridad y excelencia en todos nuestros
					procesos.
				</InfoCard>
			</div>
			</section>
		</Container>
	);
};

export default AboutUs;
