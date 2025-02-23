"use client";

import { useMobileSidebar } from "@/hooks/use-mobile-sidebar";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Sidebar } from "./sidebar";
import { DialogTitle } from "@radix-ui/react-dialog";

const MobileSidebar = () => {
	const isOpen = useMobileSidebar(state => state.isOpen);
	const onOpen = useMobileSidebar(state => state.onOpen);
	const onClose = useMobileSidebar(state => state.onClose);
	const [isMounted, setIsMounted] = useState(false);
	const pathname = usePathname();

	useEffect(() => {
		setIsMounted(true);
	}, []);

	useEffect(() => {
		onClose();
	}, [pathname, onClose]);

	if (!isMounted) return null;

	return (
		<>
			<Button
				className="block md:hidden"
				variant="ghost"
				onClick={onOpen}
				size="sm"
			>
				<Menu className="h-4 w-4" />
			</Button>
			<Sheet open={isOpen} onOpenChange={onClose}>
				<SheetContent side="left" className="p-2 pt-10">
					<DialogTitle className="sr-only">
						Mobile Sidebar
					</DialogTitle>
					<Sidebar storageKeys="t-mobile-sidebar-state" />
				</SheetContent>
			</Sheet>
		</>
	);
};

export default MobileSidebar;
