import { List, Card } from "@prisma/client";

export type ListWithCards = List & { cards: Card[] };
export type CardWithLists = Card & { list: List };
