"use client";

import {
	Popover,
	PopoverClose,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

import { create } from "@/actions/createBoard";
import { useRef } from "react";

import { FormInput } from "./form-input";
import { X } from "lucide-react";
import { Button } from "../ui/button";
import { FormSubmit } from "./form-submit";
import { useActionState } from "react";
import { toast } from "sonner";
import { FormPicker } from "./form-picker";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProModal } from "@/hooks/use-pro-modal";

interface FormPopoverProps {
	children: React.ReactNode;
	side?: "left" | "right" | "top" | "bottom";
	align?: "start" | "center" | "end";
	sideOffset?: number;
}

export const FormPopover = ({
	children,
	side = "bottom",
	align,
	sideOffset = 0,
}: FormPopoverProps) => {
	const closeRef = useRef<HTMLButtonElement | null>(null);
	const initialState = { message: null, errors: {} };
	const [state, dispatch] = useActionState(create, initialState);
	const router = useRouter();
	const proModal = useProModal();

	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(() => {
		if (!state?.message) return; // Prevents empty toast on reload

		if (state.message === "Board created successfully") {
			toast.success("Board Created!");
			// closing popover on create
			closeRef?.current?.click();
			if (state.boardId) {
				router.push(`/board/${state.boardId}`);
			}
		} else if (
			state.message ===
			"You have reached the maximum number of boards for this organization"
		) {
			toast.success(state.message);
			proModal.onOpen();
		} else {
			toast.success(state.message);
		}
	}, [state?.message]);

	return (
		<Popover>
			<PopoverTrigger asChild>{children}</PopoverTrigger>
			<PopoverContent
				align={align}
				className="w-80 pt-3"
				side={side}
				sideOffset={sideOffset}
			>
				<div className="text-sm font-medium text-center text-neutral-600 pb-4">
					Create board
				</div>
				<PopoverClose ref={closeRef} asChild>
					<Button
						className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600"
						variant="ghost"
					>
						<X className="h-4 w-4" />
					</Button>
				</PopoverClose>
				<form action={dispatch} className="space-y-4">
					<FormPicker id="image" errors={state?.errors} />
					<div className="space-y-4">
						<FormInput
							id="title"
							label="Board title"
							type="text"
							errors={state?.errors}
						/>
					</div>

					<FormSubmit className="w-full">Create</FormSubmit>
				</form>
			</PopoverContent>
		</Popover>
	);
};
