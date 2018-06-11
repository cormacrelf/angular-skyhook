import { Component, Input } from "@angular/core";
import { DropEvent } from "angular-skyhook-card-list";
import { Lists } from "./lists";
import { default as update } from "immutability-helper";
import { Card } from "./card";

@Component({
    selector: "kanban-container",
    templateUrl: "./container.component.html",
    styleUrls: ["./container.component.scss"]
})
export class KanbanContainerComponent {
    ItemTypes = { CARD: "KANBAN_CARD", LIST: "KANBAN_LIST" };
    lists = Lists;
    nextId = 16;

    dropCard(drop: DropEvent) {
        // not bulletproof, but OK
        const { id, from, to } = drop;
        const fromListIdx = this.lists.findIndex(b => b.id === from.listId);
        const toListIdx = this.lists.findIndex(b => b.id === to.listId);
        const item = this.lists[fromListIdx].cards.find(i => i.id === id);

        const _ls = update(this.lists, {
            [fromListIdx]: { cards: { $splice: [[from.index, 1]] } }
        });
        this.lists = update(_ls, {
            [toListIdx]: { cards: { $splice: [[to.index, 0, item]] } }
        });
    }

    dropList(drop: DropEvent) {
        const { id, from, to } = drop;
        const list = this.lists.find(i => i.id === id);
        this.lists = update(this.lists, {
            $splice: [[from.index, 1], [to.index, 0, list]]
        });
    }

    addCard(listId: number, title: string) {
        const listIdx = this.lists.findIndex(l => l.id === listId);
        const card: Card = { id: this.nextId++, title };
        this.lists = update(this.lists, {
            [listIdx]: { cards: { $push: [card] } }
        });
    }

    trackById(_, x: { id: any }) {
        return x.id;
    }
}
