"use client";

import { FormSubmit } from "@/components/form/form-submit";
import { FormTextarea } from "@/components/form/form-textarea";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import {
	forwardRef,
	useActionState,
	useRef,
	KeyboardEventHandler,
} from "react";
import { useParams } from "next/navigation";
import { createCard } from "@/actions/createCard";
import { useEventListener, useOnClickOutside } from "usehooks-ts";

interface CardFormProps {
	listId: string;
	enableEditing: () => void;
	disableEditing: () => void;
	isEditing: boolean;
}

export const CardForm = forwardRef<HTMLTextAreaElement, CardFormProps>(
	({ listId, enableEditing, disableEditing, isEditing }, ref) => {
		const formRef = useRef<HTMLFormElement>(null);
		const params = useParams();
		const boardId = params.boardId;
		console.log(boardId);
		const initialState = { message: null, errors: {} };
		const [state, dispatch] = useActionState(createCard, initialState);

		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "escape") {
				disableEditing();
			}
		};

		const onTextareaKeyDown: KeyboardEventHandler<
			HTMLTextAreaElement
		> = e => {
			if (e.key === "Enter" && !e.shiftKey) {
				e.preventDefault();
				formRef.current?.requestSubmit();
			}
		};

		useOnClickOutside(formRef, disableEditing);
		useEventListener("keydown", onKeyDown);

		if (isEditing) {
			return (
				<form
					ref={formRef}
					action={dispatch}
					className="px-2 space-y-2"
				>
					<FormTextarea
						id="title"
						onKeyDown={onTextareaKeyDown}
						placeholder="Enter a title for this card..."
						ref={ref}
						errors={state?.errors}
					/>
					<input hidden id="listId" name="listId" value={listId} />
					<input hidden id="boardId" name="boardId" value={boardId} />
					<div className="flex items-center gap-x-1">
						<FormSubmit>Add Card</FormSubmit>
						<Button
							onClick={disableEditing}
							className="h-auto w-auto"
							variant="ghost"
							size="sm"
						>
							<X className="w-4 h-4" />
						</Button>
					</div>
				</form>
			);
		}

		return (
			<div className="px-2 p2-2">
				<Button
					onClick={enableEditing}
					variant="ghost"
					className="w-full justify-start text-sm h-auto px-2 py-1.5  text-muted-foreground"
				>
					<Plus className="w-4 h-4" />
					Add a card
				</Button>
			</div>
		);
	}
);

CardForm.displayName = "CardForm";
