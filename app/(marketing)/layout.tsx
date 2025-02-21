import { Navbar } from "./_components/Navbar";
import { Footer } from "./_components/Footer";

const MarketingLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="h-full bg-slate-100">
			<Navbar />
			<main>{children}</main>
			<Footer />
		</div>
	);
};

export default MarketingLayout;
