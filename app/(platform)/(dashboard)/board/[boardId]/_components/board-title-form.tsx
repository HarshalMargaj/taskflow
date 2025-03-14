"use client";

import { FormInput } from "@/components/form/form-input";
import { Button } from "@/components/ui/button";

import { useRef, useState } from "react";
import { update } from "@/actions/updateBoard";
import { useParams } from "next/navigation";
import { toast } from "sonner";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface BoardTitleFormProps {
	data: Record<string, any>;
}

export const BoardTitleForm = ({ data }: BoardTitleFormProps) => {
	const params = useParams();
	const [isEditing, setIsEditing] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const formRef = useRef<HTMLFormElement>(null);
	const [error, setError] = useState<string>();
	const [title, setTitle] = useState(data.title);
	const boardId = params.boardId as string;
	const disableEditing = () => {
		setIsEditing(false);
	};

	const enableEditing = () => {
		setIsEditing(true);
		setTimeout(() => {
			inputRef.current?.focus();
			inputRef.current?.select();
		});
	};

	const onSubmit = async (formData: FormData) => {
		const title = formData.get("title") as string;
		if (!title) {
			toast.error("Title is required");
			return;
		}

		if (title.length < 3) {
			toast.error("Title must be at least 3 characters long");
			return;
		}

		try {
			const response = await update({ id: boardId, title });

			if (response.errors) {
				setError(response.errors.title?.[0] || "An error occurred");
				return;
			}
			setTitle(title);
			toast.success("Board updated successfully");
			disableEditing();
		} catch (error) {
			toast.error("Something went wrong. Please try again.");
		}
	};

	const onBlur = () => {
		formRef.current?.requestSubmit();
	};

	if (isEditing) {
		return (
			<form action={onSubmit} ref={formRef}>
				<FormInput
					ref={inputRef}
					id="title"
					defaultValue={title}
					onBlur={onBlur}
				/>
				{error && <p>{error}</p>}
			</form>
		);
	}

	return (
		<Button
			variant="transparent"
			onClick={enableEditing}
			className="font-bold text-md"
		>
			{title}
		</Button>
	);
};
