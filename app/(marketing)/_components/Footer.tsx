import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

export const Footer = () => {
	return (
		<div className="bg-white fixed bottom-0 w-full flex items-center p-4 border-t">
			<div className="md:max-w-screen-2xl mx-auto w-full flex items-center justify-between">
				<Logo />
				<div className="flex items-center justify-between space-x-4 md:block md:w-auto w-full">
					<Button size="sm" variant="ghost">
						Privacy Policies
					</Button>
					<Button size="sm" variant="ghost">
						Terms of service
					</Button>
				</div>
			</div>
		</div>
	);
};
