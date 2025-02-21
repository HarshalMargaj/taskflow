import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const Navbar = () => {
	return (
		<div className="bg-white h-14 shadow-sm fixed top-0 w-full flex items-center px-4 border-b">
			<div className="md:max-w-screen-2xl mx-auto w-full flex items-center justify-between">
				<Logo />
				<div className="flex items-center justify-between space-x-4 md:block md:w-auto w-full">
					<Button size="sm" asChild variant="outline">
						<Link href="/sign-in">Log in</Link>
					</Button>
					<Button size="sm" asChild>
						<Link href="/sign-up">Get TaskFlow for free</Link>
					</Button>
				</div>
			</div>
		</div>
	);
};
