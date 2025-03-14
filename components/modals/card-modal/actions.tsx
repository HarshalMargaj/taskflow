"use client";

import { copyCard } from "@/actions/copyCard";
import { deleteCard } from "@/actions/deleteCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCardModal } from "@/hooks/use-card-modal";
import { CardWithLists } from "@/types";
import { Copy, Trash } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

interface ActionsProps {
	data: CardWithLists;
}

export const Actions = ({ data }: ActionsProps) => {
	const params = useParams();
	const onClose = useCardModal(state => state.onClose);

	const boardId = params.boardId as string;
	const id = data.id;

	const onCopy = () => {
		copyCard({ id, boardId });
		onClose();
		toast.success(`Card ${data.title} Copied Successfully`);
	};

	const onDelete = () => {
		deleteCard({ id, boardId });
		onClose();
		toast.success(`Card ${data.title} Deleted Successfully`);
	};

	return (
		<div className="space-y-2 mt-2">
			<p className="text-sm font-semibold">Actions</p>
			<Button
				onClick={onCopy}
				variant="gray"
				className="w-full justify-start"
				size="inline"
			>
				<Copy className="h-4 w-4 mr-2" />
				Copy
			</Button>
			<Button
				onClick={onDelete}
				variant="gray"
				className="w-full justify-start"
				size="inline"
			>
				<Trash className="h-4 w-4 mr-2" />
				Delete
			</Button>
		</div>
	);
};

Actions.Skeleton = function ActionsSkeleton() {
	return (
		<div className="space-y-2 mt-2">
			<Skeleton className="w-20 h-4 bg-neutral-200" />
			<Skeleton className="w-full h-8 bg-neutral-200" />
			<Skeleton className="w-full h-8 bg-neutral-200" />
		</div>
	);
};
