import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import MobileSidebar from "./mobile-sidebar";
import { FormPopover } from "@/components/form/form-popover";

export const Navbar = () => {
	return (
		<div className="fixed top-0 z-50 bg-white w-full border-b shadow-sm h-14 px-4 flex items-center justify-between">
			<div className="flex items-center gap-4">
				<MobileSidebar />
				<div className="flex items-center gap-4">
					<div className="hidden md:block">
						<Logo />
					</div>
					<FormPopover align="start" side="bottom">
						<Button
							variant="primary"
							size="sm"
							className="hidden md:block"
						>
							Create
						</Button>
					</FormPopover>
					<FormPopover align="start" side="bottom">
						<Button
							variant="primary"
							size="sm"
							className="block md:hidden"
						>
							<Plus className="h-4 w-4" />
						</Button>
					</FormPopover>
				</div>
			</div>
			<div className="flex items-center">
				<div>
					<OrganizationSwitcher
						hidePersonal
						afterCreateOrganizationUrl="/organization/:id"
						afterLeaveOrganizationUrl="/select-org"
						afterSelectOrganizationUrl="/organization/:id"
						appearance={{
							elements: {
								rootBox: {
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
								},
							},
						}}
					/>
				</div>
				<div className="flex items-center justify-center">
					<UserButton
						appearance={{
							elements: {
								avatarBox: {
									height: "30",
									width: "30",
								},
							},
						}}
					/>
				</div>
			</div>
		</div>
	);
};
