import { BoardTitleForm } from "./board-title-form";
import { BoardOptions } from "./board-options";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface BoardNavbarProps {
	data: Record<string, any>;
}

export const BoardNavbar = async ({ data }: BoardNavbarProps) => {
	return (
		<div className="fixed w-full h-14 z-40 bg-black/50 top-14 flex items-center px-6 gap-x-4 text-white">
			<BoardTitleForm data={data} />
			<div className="ml-auto">
				<BoardOptions id={data.id} />
			</div>
		</div>
	);
};
