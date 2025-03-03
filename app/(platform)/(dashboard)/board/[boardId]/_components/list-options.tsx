"use client";

import { List } from "@prisma/client";
import {
	Popover,
	PopoverTrigger,
	PopoverContent,
	PopoverClose,
} from "@/components/ui/popover";
import { MoreHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormSubmit } from "@/components/form/form-submit";
import { Separator } from "@/components/ui/separator";
import { deleteList } from "@/actions/deleteList";

interface ListOptionsProps {
	data: List;
	onAddCard: () => void;
}

export const ListOptions = ({ data, onAddCard }: ListOptionsProps) => {
	const delList = (formData: FormData) => {
		const id = formData.get("id") as string;
		const boardId = formData.get("boardId") as string;

		deleteList(id, boardId);
	};

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					className="h-auto w-auto p-2 hover:bg-black/10"
					variant="ghost"
				>
					<MoreHorizontal className="h-4 w-4 " />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="px-0 py-3" align="start" side="bottom">
				<div className="text-sm font-medium text-neutral-700 text-center pb-4">
					List Options
				</div>
				<PopoverClose asChild>
					<Button
						variant="ghost"
						className="absolute right-2 top-2 w-auto h-auto text-neutral-700"
					>
						<X className="w-4 h-4" />
					</Button>
				</PopoverClose>
				<Button
					onClick={onAddCard}
					variant="ghost"
					className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
				>
					Add Card
				</Button>
				<form action="">
					<input hidden id="id" name="id" value={data.id} />
					<input
						hidden
						id="boardId"
						name="boardId"
						value={data.boardId}
					/>
					<FormSubmit
						className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
						variant="ghost"
					>
						Copy List
					</FormSubmit>
				</form>
				<Separator />
				<form action={delList}>
					<input hidden id="id" name="id" value={data.id} />
					<input
						hidden
						id="boardId"
						name="boardId"
						value={data.boardId}
					/>
					<FormSubmit
						className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
						variant="ghost"
					>
						Delete List
					</FormSubmit>
				</form>
			</PopoverContent>
		</Popover>
	);
};
