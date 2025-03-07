import { Sidebar } from "../_components/sidebar";

const OrganizationLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="pt-20 md:pt-20 px-4 max-w-6xl md:max-w-screen-xl mx-auto">
			<div className="flex gap-x-7">
				<div className="w-64 hidden md:block shrink-0">
					<Sidebar />
				</div>
				{children}
			</div>
		</div>
	);
};

export default OrganizationLayout;
