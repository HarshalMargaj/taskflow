"use client";

import { useProModal } from "@/hooks/use-pro-modal";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import Image from "next/image";
import { Button } from "../ui/button";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { stripeRedirect } from "@/actions/stripeRedirect";

export const ProModal = () => {
	const { isOpen, onClose } = useProModal();

	const onClick = async () => {
		const response = await stripeRedirect();
		if (response?.data) {
			window.location.href = response.data; // Redirect to Stripe checkout
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<VisuallyHidden>
				<DialogTitle>Card Details</DialogTitle>
			</VisuallyHidden>
			<DialogContent className="max-w-md p-0 overflow-hidden">
				<div className="h-[380px] relative flex items-center justify-center">
					<Image
						src="https://img.freepik.com/free-vector/concept-landing-page-credit-card-payment_52683-25532.jpg?t=st=1741950582~exp=1741954182~hmac=67817f8e618e0b3474d9016260b0e60e70b30f4a05178a59ab78e011a6332aed&w=2000"
						alt="hero"
						className="object-cover"
						fill
					/>
				</div>
				<div className="text-neutral-700 mx-auto space-y-4 p-6">
					<h2 className="font-semibold text-xl">
						Upgrade to TaskFlow pro today!
					</h2>
					<p className="text-xs font-semibold text-neutral-600">
						Explore the best of TaskFlow
					</p>
					<div className="pl-3">
						<ul className="list-disc text-sm">
							<li>Unlimited Boards</li>
							<li>Advance Checklist</li>
							<li>Admin and security features</li>
							<li>And more!</li>
						</ul>
					</div>
					<Button
						onClick={onClick}
						className="w-full"
						variant="primary"
					>
						Upgrade
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};
