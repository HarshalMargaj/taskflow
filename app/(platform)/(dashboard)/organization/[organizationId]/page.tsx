import { db } from "@/lib/db";
import { Board } from "./board";
import { Form } from "./form";

const OrganizationPage = async () => {
	const boards = await db.boardsTable?.findMany();
	return (
		<div>
			<Form />
			<div>
				{boards.map(board => (
					<Board key={board.id} id={board.id} title={board.title} />
				))}
			</div>
		</div>
	);
};

export default OrganizationPage;
