import { BoardTitleForm } from "./board-title-form";

interface BoardNavbarProps {
	data: Record<string, any>;
}

export const BoardNavbar = async ({ data }: BoardNavbarProps) => {
	return (
		<div className="fixed w-full h-14 z-40 bg-black/50 top-14 flex items-center px-6 gap-x-4 text-white">
			<BoardTitleForm data={data} />
		</div>
	);
};
