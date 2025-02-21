import { ClerkProvider } from "@clerk/nextjs";

const PlatformLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<ClerkProvider>
			<div className="h-full">{children}</div>;
		</ClerkProvider>
	);
};

export default PlatformLayout;
