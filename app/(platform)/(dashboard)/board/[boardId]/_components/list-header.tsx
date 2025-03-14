"use client";

import { List } from "@prisma/client";
import { useRef, useState } from "react";
import { FormInput } from "@/components/form/form-input";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { updateList } from "@/actions/updateList";
import { toast } from "sonner";
import { ListOptions } from "./list-options";

interface ListHeaderProps {
	data: List;
	onAddCard: () => void;
}

export const ListHeader = ({ data, onAddCard }: ListHeaderProps) => {
	const [title, setTitle] = useState(data.title);
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

	const onBlur = () => {
		formRef.current?.requestSubmit();
	};

	const onSubmit = async (formData: FormData) => {
		const title = formData.get("title") as string;

		if (!title) {
			toast.error("Title is required");
			return;
		}

		if (title?.length < 3) {
			toast.error("Title must be at least 3 characters long");
			return;
		}

		try {
			await updateList(formData);
			setTitle(title);
			toast.success("List updated successfully");
			disableEditing();
		} catch (error) {
			console.error("Update list error:", error);
			toast.error("Something went wrong. Please try again.");
		}
	};

	useEventListener("keydown", onKeyDown);

	useOnClickOutside(formRef, disableEditing);

	return (
		<div className="flex items-center justify-between pt-2 px-2 font-semibold gap-x-2 text-sm">
			{isEditing ? (
				<form ref={formRef} action={onSubmit} className="w-full">
					<input hidden id="id" name="id" value={data.id} />
					<input
						hidden
						id="boardId"
						name="boardId"
						value={data.boardId}
					/>
					<FormInput
						id="title"
						onBlur={onBlur}
						ref={inputRef}
						placeholder="Enter a title..."
						defaultValue={title}
						className="text-sm px-[7px] py-1 h-7 font-medium border-transparent hover:border-input focus:border-input transition truncate bg-transparent focus:bg-white"
					/>
					<button type="submit" hidden></button>
				</form>
			) : (
				<div
					className="w-full text-sm px-2.5 py-1 h-7 font-medium border-transparent"
					onClick={enableEditing}
				>
					{title}
				</div>
			)}
			<ListOptions data={data} onAddCard={onAddCard} />
		</div>
	);
};
