"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useCardModal } from "@/hooks/use-card-modal";
import { fetcher } from "@/lib/fetcher";
import { CardWithLists } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Header } from "./header";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export const CardModal = () => {
	const id = useCardModal(state => state.id);
	console.log("card id", id);
	const isOpen = useCardModal(state => state.isOpen);
	const onClose = useCardModal(state => state.onClose);
	const { data: cardData } = useQuery<CardWithLists>({
		queryKey: ["card", id],
		queryFn: () => fetcher(`/api/cards/${id}`),
	});

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent>
				<VisuallyHidden>
					<DialogTitle>Card Details</DialogTitle>
				</VisuallyHidden>
				{!cardData ? <Header.Skeleton /> : <Header data={cardData} />}
			</DialogContent>
		</Dialog>
	);
};
