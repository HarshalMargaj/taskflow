"use client";

import { stripeRedirect } from "@/actions/stripeRedirect";
import { Button } from "@/components/ui/button";
import { useProModal } from "@/hooks/use-pro-modal";

interface SubscriptionButtonProps {
	isPro: boolean;
}

export const SubscriptionButton = ({ isPro }: SubscriptionButtonProps) => {
	const proModal = useProModal();
	const onClick = async () => {
		if (isPro) {
			const response = await stripeRedirect();
			if (response?.data) {
				window.location.href = response.data;
			}
		} else {
			proModal.onOpen();
		}
	};
	return (
		<Button variant="primary" onClick={onClick}>
			{isPro ? "Manage Subscription" : "Upgrade to pro"}
		</Button>
	);
};
