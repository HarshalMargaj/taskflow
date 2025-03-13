"use client";

import { useActionState, useRef, useState } from "react";

import { FormInput } from "@/components/form/form-input";
import { CardWithLists } from "@/types";
import { Layout } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { updateCard } from "@/actions/updateCard";
import { toast } from "sonner";

interface HeaderProps {
	data: CardWithLists;
}

export const Header = ({ data }: HeaderProps) => {
	const params = useParams();
	const inputRef = useRef<HTMLInputElement>(null);
	const [title, setTitle] = useState(data.title);

	const onBlur = () => {
		inputRef.current?.form?.requestSubmit();
	};

	const onSubmit = (formData: FormData) => {
		const id = data.id;
		const boardId = params.boardId as string;
		const title = formData.get("title") as string;

		updateCard({ id, boardId, title });
		setTitle(title);
		toast.success("Card updated successfully");
	};

	return (
		<div className="flex gap-x-3 mb-6 w-full">
			<Layout className="w-5 h-5 mt-1 text-neutral-700" />
			<div className="w-full">
				<form action={onSubmit}>
					<FormInput
						ref={inputRef}
						onBlur={onBlur}
						id="title"
						defaultValue={title}
						className="font-semibold text-xl px-1 text-neutral-700 bg-transparent border-transparent relative -left-1.5 w-[95%] focus-visible:bg-white focus-visible:border-input mb-0.5 truncate"
					/>
				</form>
				<p className="text-sm text-muted-foreground">
					in list <span className="underline">{data.list.title}</span>
				</p>
			</div>
		</div>
	);
};

Header.Skeleton = function HeaderSkeleton() {
	return (
		<div className="flex gap-x-3 mb-6">
			<Skeleton className="w-6 h-6 mt-1 bg-neutral-200" />
			<div>
				<Skeleton className="w-24 h-6 mb-1 bg-neutral-200" />
				<Skeleton className="w-12 h-6 bg-neutral-200" />
			</div>
		</div>
	);
};
