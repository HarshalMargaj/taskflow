import Image from "next/image";
import Link from "next/link";
import localFont from "next/font/local";
import { cn } from "@/lib/utils";

const logoFont = localFont({
	src: "../public/fonts/CalSans-SemiBold.ttf", // Correct font path
});

export const Logo = () => {
	return (
		<Link href="/">
			<div className="items-center gap-2 cursor-pointer hidden md:flex hover:opacity-70 transition">
				<Image src="/logo.png" alt="Logo" width={30} height={30} />
				<div className={cn("text-xl", logoFont.className)}>
					TaskFlow
				</div>
			</div>
		</Link>
	);
};
