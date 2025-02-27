import { deleteBoard } from "@/actions/deleteBoard";
import { DeleteButton } from "./delete-button";

interface BoardProps {
	id: string;
	title: string;
}

export const Board = ({ id, title }: BoardProps) => {
	const deleteButtonWithId = deleteBoard.bind(null, id);
	return (
		<form
			action={deleteButtonWithId}
			className="flex items-center space-x-2"
		>
			<div>{title}</div>
			<DeleteButton />
		</form>
	);
};
