"use client";

import { ListWrapper } from "./list-wrapper";

import { FormInput } from "@/components/form/form-input";
import { FormSubmit } from "@/components/form/form-submit";
import { Button } from "@/components/ui/button";

import { Plus, X } from "lucide-react";

import { useState, useRef } from "react";
import { useActionState } from "react";
import { useParams } from "next/navigation";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { createList } from "@/actions/createList";

interface ListFormProps {}

export const ListForm = () => {
	const initialState = { message: null, errors: {} };
	const [state, dispatch] = useActionState(createList, initialState);
	const params = useParams();
	const [isEditing, setIsEditing] = useState(false);
	const formRef = useRef<HTMLFormElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	const enableEditing = () => {
		setIsEditing(true);
		setTimeout(() => {
			inputRef.current?.focus();
			inputRef.current?.select();
		});
	};

	const disableEditing = () => {
		setIsEditing(false);
	};

	const onKeyDown = (e: KeyboardEvent) => {
		if (e.key === "Escape") {
			disableEditing();
		}
	};

	useEventListener("keydown", onKeyDown);
	useOnClickOutside(formRef, disableEditing);

	if (isEditing) {
		return (
			<ListWrapper>
				<form
					action={dispatch}
					ref={formRef}
					className="w-full p-2 rounded-md bg-white shadow-md space-y-4"
				>
					<FormInput
						ref={inputRef}
						id="title"
						className="text-sm px-2 py-1 h-7 font-medium border-transparent hover:border-input focus:border-input transition"
						placeholder="Enter list title..."
						errors={state?.errors}
					/>
					<input hidden value={params.boardId} name="boardId" />
					<div className="flex items-center gap-x-1">
						<FormSubmit>Add list</FormSubmit>
						<Button
							onClick={disableEditing}
							variant="ghost"
							size="sm"
						>
							<X className="h-5 w-5" />
						</Button>
					</div>
				</form>
			</ListWrapper>
		);
	}

	return (
		<ListWrapper>
			<button
				className="w-full rounded-md bg-white/80 hover:bg-white/50 transition p-3 flex items-center font-medium text-sm"
				onClick={enableEditing}
			>
				<Plus className="h-4 w-4 mr-2" />
				Add a list
			</button>
		</ListWrapper>
	);
};
