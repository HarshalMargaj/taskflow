"use client";

import { ListWithCards } from "@/types";
import { ListForm } from "./list-form";
import { useState, useEffect } from "react";
import { ListItem } from "./list-item";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { updateListOrder } from "@/actions/UpdateListOrder";
import { updateCardOrder } from "@/actions/updateCardOrder";

interface ListContainerProps {
	data: ListWithCards[];
	boardId: string;
}

// to reorder the indexes
function reorder<T>(list: T[], startIndex: number, endIndex: number): T[] {
	const result = Array.from(list);
	const [removed] = result.splice(startIndex, 1);
	result.splice(endIndex, 0, removed);
	return result;
}

export const ListContainer = ({ data, boardId }: ListContainerProps) => {
	const [orderedData, setOrderedData] = useState(data);

	useEffect(() => {
		setOrderedData(data);
	}, [data]);

	const onDragEnd = (result: any) => {
		const { destination, source, type } = result;

		if (!destination) {
			return;
		}

		// checking if the destination is the same as the source
		// means the item was dropped in the same place
		if (
			destination.droppableId === source.droppableId &&
			destination.index === source.index
		) {
			return;
		}

		if (type === "list") {
			const reorderedItems = reorder(
				orderedData,
				source.index,
				destination.index
			).map((item, index) => ({
				id: item.id,
				order: index, // this becomes the new order
			}));

			setOrderedData(
				reorder(orderedData, source.index, destination.index)
			);

			updateListOrder({ items: reorderedItems, boardId });
		}

		if (type === "card") {
			let newOrderedData = [...orderedData];

			const sourceList = newOrderedData.find(
				list => list.id === source.droppableId
			);
			const destinationList = newOrderedData.find(
				list => list.id === destination.droppableId
			);

			if (!sourceList || !destinationList) {
				return;
			}

			if (!sourceList.cards) {
				sourceList.cards = [];
			}

			if (!destinationList.cards) {
				destinationList.cards = [];
			}

			if (source.droppableId === destination.droppableId) {
				const reorderedCards = reorder(
					sourceList.cards,
					source.index,
					destination.index
				);

				reorderedCards.forEach((card, index) => {
					card.order = index;
				});

				sourceList.cards = reorderedCards;
				setOrderedData(newOrderedData);

				const reorderedItems = reorderedCards.map(card => ({
					id: card.id,
					listId: card.listId,
					order: card.order,
				}));

				updateCardOrder({ items: reorderedItems });
			} else {
				// moves card to another list
				const [moveCard] = sourceList.cards.splice(source.index, 1);

				// assing new id to movecard

				moveCard.listId = destinationList.id;

				destinationList.cards.splice(destination.index, 0, moveCard);

				// updates the order of the cards in the source list
				sourceList.cards.forEach((card, index) => {
					card.order = index;
				});

				// updates the order of the cards in the destination list
				destinationList.cards.forEach((card, index) => {
					card.order = index;
				});

				setOrderedData(newOrderedData);

				const updatedDestinationItems = destinationList.cards.map(
					card => ({
						id: card.id,
						listId: destinationList.id,
						order: card.order,
					})
				);

				updateCardOrder({
					items: updatedDestinationItems,
				});
			}
		}
	};

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<Droppable droppableId="lists" type="list" direction="horizontal">
				{provided => (
					<ol
						{...provided.droppableProps}
						ref={provided.innerRef}
						className="flex gap-x-3 h-full"
					>
						{orderedData.map((list, index) => (
							<ListItem index={index} key={list.id} data={list} />
						))}
						{provided.placeholder}
						<ListForm />
						<div className="flex-shrink-0 w-1" />
					</ol>
				)}
			</Droppable>
		</DragDropContext>
	);
};
