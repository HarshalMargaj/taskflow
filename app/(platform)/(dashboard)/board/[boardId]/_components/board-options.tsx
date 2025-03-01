"use client";

import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverTrigger,
	PopoverContent,
	PopoverClose,
} from "@/components/ui/popover";
import { MoreHorizontal, X } from "lucide-react";
import { deleteBoard } from "@/actions/deleteBoard";

interface BoardOptionsProps {
	id: string;
}

export const BoardOptions = ({ id }: BoardOptionsProps) => {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button className="h-auto w-auto" variant="transparent">
					<MoreHorizontal className="w-4 h-4" />
				</Button>
			</PopoverTrigger>
			<PopoverContent
				className="py-3 px10 space-y-2"
				side="bottom"
				align="start"
			>
				<div className="text-sm font-medium text-center text-neutral-600">
					Board options
				</div>
				<PopoverClose asChild>
					<Button
						size="sm"
						variant="ghost"
						className="w-auto h-auto absolute top-1 right-1 py-1"
					>
						<X className="h-4 w-3" />
					</Button>
				</PopoverClose>
				<Button
					variant="ghost"
					className="w-full"
					onClick={() => {
						deleteBoard(id);
					}}
				>
					Delete this board
				</Button>
			</PopoverContent>
		</Popover>
	);
};
