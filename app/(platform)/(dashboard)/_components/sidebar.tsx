"use client";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useLocalStorage } from "usehooks-ts";
import { useOrganization, useOrganizationList } from "@clerk/nextjs";
import { Skeleton } from "@/components/ui/skeleton";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

import { NavItem, Organization } from "./navItem";

interface SidebarProps {
	storageKeys?: string;
}

export const Sidebar = ({ storageKeys = "t-sidebar-state" }: SidebarProps) => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const [expanded, setExpanded] = useLocalStorage<Record<string, any>>(
		storageKeys,
		{}
	);

	const { organization: activeOrganization, isLoaded: isLoadedOrg } =
		useOrganization();

	const { userMemberships, isLoaded: isLoadedOrgList } = useOrganizationList({
		userMemberships: {
			infinite: true,
		},
	});

	const defaultAccordionValue: string[] = Object.keys(expanded).reduce(
		(acc: string[], key: string) => {
			if (expanded[key]) {
				acc.push(key);
			}
			return acc;
		},
		[]
	);

	if (!isLoadedOrg || !isLoadedOrgList || userMemberships.isLoading) {
		return (
			<>
				<div className="flex items-center justify-between mb-2">
					<Skeleton className="h-10 w-[50%]" />
					<Skeleton className="h-10 w-10" />
				</div>
				<div className="space-y-2">
					<NavItem.Skeleton />
					<NavItem.Skeleton />
					<NavItem.Skeleton />
				</div>
			</>
		);
	}

	const onExpand = (id: string) => {
		setExpanded(curr => ({ ...curr, [id]: !expanded[id] }));
	};

	return (
		<>
			<div className="flex items-center">
				<div className="font-medium">Workspaces</div>
				<Button
					asChild
					variant="ghost"
					className="ml-auto"
					size="icon"
					type="button"
				>
					<Link href="/select-org">
						<Plus className="h-4 w-4" />
					</Link>
				</Button>
			</div>
			<Accordion
				type="multiple"
				defaultValue={defaultAccordionValue}
				className="space-y-2"
			>
				{userMemberships.data.map(({ organization }) => (
					<NavItem
						key={organization.id}
						isActive={activeOrganization?.id === organization.id}
						isExpanded={expanded[organization.id]}
						organization={organization as Organization}
						onExpand={onExpand}
					/>
				))}
			</Accordion>
		</>
	);
};
