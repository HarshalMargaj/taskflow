"use client";
import {
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Activity, CreditCard, Layout, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

export type Organization = {
	id: string;
	slug: string;
	imageUrl: string;
	name: string;
};

interface NavItemProps {
	isActive: boolean;
	isExpanded: boolean;
	organization: Organization;
	onExpand: (id: string) => void;
}

export const NavItem = ({
	isActive,
	isExpanded,
	organization,
	onExpand,
}: NavItemProps) => {
	const router = useRouter();
	const pathname = usePathname();
	const routes = [
		{
			label: "Boards",
			icon: <Layout />,
			href: `/organization/${organization.id}`,
		},
		{
			label: "Activity",
			icon: <Activity />,
			href: `/organization/${organization.id}/activity`,
		},
		{
			label: "Settings",
			icon: <Settings />,
			href: `/organization/${organization.id}/settings`,
		},
		{
			label: "Billing",
			icon: <CreditCard />,
			href: `/organization/${organization.id}/billing`,
		},
	];

	const onClick = (href: string) => {
		router.push(href);
	};

	return (
		<AccordionItem value={organization.id} className="border-none">
			<AccordionTrigger
				onClick={() => onExpand(organization.id)}
				className={cn(
					"flex items-center gap-x-2 p-1.5 text-neutral-700 rounded-md hover:bg-neutral-500/10 transition text-start no-underline hover:no-underline",
					isActive && !isExpanded && "bg-sky-500/10 text-sky-700"
				)}
			>
				<div className="flex items-center gap-x-2">
					<div className="w-6 h-7 relative">
						<Image
							fill
							src={organization.imageUrl}
							alt="organization"
							className="rouded-sm object-cover"
						></Image>
					</div>
					<div className="font-semibold text-sm">
						{organization.name}
					</div>
				</div>
			</AccordionTrigger>
			<AccordionContent className="space-y-1 pt-1 text-neutral-700">
				{routes.map(route => (
					<Button
						key={route.label}
						onClick={() => onClick(route.href)}
						className={cn(
							"flex justify-start  pl-10 w-full flex-start",
							pathname === route.href &&
								"bg-sky-500/10 text-sky-700"
						)}
						variant="ghost"
					>
						{route.icon}
						{route.label}
					</Button>
				))}
			</AccordionContent>
		</AccordionItem>
	);
};

NavItem.Skeleton = function NavItemSkeleton() {
	return (
		<div className="flex items-center gap-x-2">
			<div className="w-10 h-10 relative shrink-0">
				<Skeleton className="h-full w-full absolute" />
			</div>
			<Skeleton className="h-10 w-full" />
		</div>
	);
};
