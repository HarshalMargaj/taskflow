import React from "react";
import { Medal } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import localFont from "next/font/local";
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";

const headingFont = localFont({
	src: "../../public/fonts/CalSans-SemiBold.ttf",
});

const textFont = Poppins({
	subsets: ["latin"],
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const page = () => {
	return (
		<div className="flex justify-center items-center flex-col gap-4 px-10 pt-40">
			<div className="flex items-center gap-4 bg-slate-200 text-blue-900 p-2 px-4 shadow-lg rounded-full font-bold">
				<Medal />
				No. 1 Task Management
			</div>
			<div
				className={cn(
					"text-3xl md:text-4xl font-semibold bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600 bg-clip-text text-transparent antialiased text-center",
					headingFont.className
				)}
			>
				Boost Your Productivity with TaskFlow
			</div>
			<div
				className={cn(
					"text-slate-500 text-center md:max-w-3xl",
					textFont.className
				)}
			>
				Managing tasks has never been easier! With TaskFlow, you can
				organize your work, track progress, and collaborate
				effortlessly. Whether you're working solo or with a team, our
				intuitive boards, lists, and cards help you stay focused and
				productive. Customize your workflow, set deadlines, and never
				miss a task again. Experience seamless project management with
				real-time updates, reminders, and integrations with your
				favorite tools. Take control of your productivity today!
			</div>
			<Button asChild size="lg">
				<Link href="/sign-up">Get TaskFlow for free</Link>
			</Button>
		</div>
	);
};

export default page;
