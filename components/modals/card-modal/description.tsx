"use client";

import { updateCard } from "@/actions/updateCard";
import { FormSubmit } from "@/components/form/form-submit";
import { FormTextarea } from "@/components/form/form-textarea";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { CardWithLists } from "@/types";
import { useQueryClient } from "@tanstack/react-query";

import { AlignLeft } from "lucide-react";

import { useParams } from "next/navigation";
import { RefObject, useRef, useState } from "react";
import { toast } from "sonner";
import { useEventListener, useOnClickOutside } from "usehooks-ts";

interface DescriptionProps {
	data: CardWithLists;
}

export const Description = ({ data }: DescriptionProps) => {
	const params = useParams();
	const queryClient = useQueryClient();
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const formRef = useRef<HTMLFormElement>(null);

	const [isEditing, setIsEditing] = useState(false);
	const [description, setDescription] = useState(data.description);

	const enableEditing = () => {
		setIsEditing(true);
		setTimeout(() => {
			textareaRef.current?.focus();
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

	const onSubmit = async (formData: FormData) => {
		const description = formData.get("description") as string;
		const boardId = params.boardId as string;
		const id = data.id;
		const title = data.title;

		await updateCard({ id, boardId, title, description });
		queryClient.invalidateQueries({ queryKey: ["card", id] });
		queryClient.invalidateQueries({ queryKey: ["auditLog", id] });
		setDescription(description);
		disableEditing();
		toast.success("Description added successfully");
	};

	useEventListener("keydown", onKeyDown);
	useOnClickOutside(formRef as RefObject<HTMLElement>, disableEditing);

	return (
		<div className="flex items-start gap-x-3 w-full">
			<AlignLeft className="h-5 w-5 mt-0.5 text-neutral-700" />

			<div className="w-full">
				<p className="font-semibold text-neutral-700 mb-2">
					Description
				</p>
				{isEditing ? (
					<form action={onSubmit} ref={formRef} className="space-y-2">
						<FormTextarea
							ref={textareaRef}
							id="description"
							className="w-full mt-2"
							placeholder="Add a more detailed description"
							defaultValue={description || undefined}
						/>
						<div className="flex items-center gap-x-2">
							<FormSubmit>Save</FormSubmit>
							<Button
								type="button"
								variant="ghost"
								size="sm"
								onClick={disableEditing}
							>
								Cancel
							</Button>
						</div>
					</form>
				) : (
					<div
						onClick={enableEditing}
						role="button"
						className="min-h-[78px] bg-neutral-200 text-sm font-medium py-3 px-3.5 rounded-md"
					>
						{description || "Add a more detailed description..."}
					</div>
				)}
			</div>
		</div>
	);
};

Description.Skeleton = function DescriptionSkeleton() {
	return (
		<div className="flex items-start gap-x-3 w-full">
			<Skeleton className="w-6 h-6 bg-neutral-200" />
			<div className="w-full">
				<Skeleton className="w-24 h-6 mb-2 bg-neutral-200" />
				<Skeleton className="w-full h-[78px] bg-neutral-200" />
			</div>
		</div>
	);
};
