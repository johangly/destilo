"use client"
import UserPanel from '@/components/UserPanel';
import RevenueDashboard from '@/components/RevenueDashboard';
import SellsAndStock from '@/components/SellsAndStock';
import Container from '@/components/Container';

export default function Home() {

	return (
		<Container>
			<div className="w-full max-w-[1200px]">
				<div className="flex gap-3 justify-center">
					<UserPanel />
					<div className="w-full flex gap-3">
						<RevenueDashboard />
						<SellsAndStock />
					</div>
				</div>
				<main className=""></main>
				<footer className=""></footer>
			</div>
		</Container>
	);
}
