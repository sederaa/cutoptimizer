import { Machine } from "xstate";
import { ListItemModel, makeEmptyListItemData, nameofListItemModel } from "common/models/ListItemModel";

export enum ListStates {
    Idle = "Idle",
    Deleting = "Deleting",
    Adding = "Adding",
    UpdatingField = "UpdatingField",
}

interface ListSchema {
    states: {
        [ListStates.Idle]: {};
        [ListStates.Deleting]: {};
        [ListStates.Adding]: {};
        [ListStates.UpdatingField]: {};
    };
}

export enum ListEvents {
    Add = "Add",
    Delete = "Delete",
    UpdateField = "UpdateField",
}

interface BaseEvent {
    type: ListEvents;
    items: ListItemModel[];
}

export interface DeleteEvent extends BaseEvent {
    type: ListEvents.Delete;
    id: number;
}
export interface UpdateFieldEvent extends BaseEvent {
    type: ListEvents.UpdateField;
    id: number;
    name: keyof Omit<ListItemModel, "id">;
    value: string;
}
export interface AddEvent extends BaseEvent {
    type: ListEvents.Add;
}
type ListEvent = AddEvent | DeleteEvent | UpdateFieldEvent;

interface ListContext {
    onItemsChanged: (items: ListItemModel[]) => void;
}

const nullIfNaN = (value: number): number | null => {
    return Number.isNaN(value) ? null : value;
};

export const ListMachine = Machine<ListContext, ListSchema, ListEvent>({
    initial: ListStates.Idle,
    context: {
        onItemsChanged: (items: ListItemModel[]) => {},
    },
    states: {
        [ListStates.Idle]: {
            on: {
                [ListEvents.Add]: {
                    target: ListStates.Adding,
                },
                [ListEvents.Delete]: {
                    target: ListStates.Deleting,
                },
                [ListEvents.UpdateField]: {
                    target: ListStates.UpdatingField,
                },
            },
        },
        [ListStates.UpdatingField]: {
            entry: (context: ListContext, event: ListEvent) => {
                const ev = event as UpdateFieldEvent;
                const items = [
                    ...ev.items.filter((i) => i.id !== ev.id),
                    {
                        ...ev.items.find((i) => i.id === ev.id),
                        [ev.name]: [nameofListItemModel("length"), nameofListItemModel("quantity")].some(
                            (x) => x === ev.name
                        )
                            ? nullIfNaN(parseInt(ev.value, 10))
                            : ev.value,
                    } as ListItemModel,
                ].sort((a, b) => a.id - b.id);
                //console.debug(`ListStates.UpdatingField: items = `, JSON.parse(JSON.stringify(items)));
                context.onItemsChanged(items);
            },
            always: ListStates.Idle,
        },
        [ListStates.Deleting]: {
            entry: (context: ListContext, event: ListEvent) => {
                const ev = event as DeleteEvent;
                let items = [...ev.items.filter((i) => i.id !== ev.id)];
                if (items.length === 0) items = [makeEmptyListItemData(0)];
                context.onItemsChanged(items);
            },
            always: ListStates.Idle,
        },
        [ListStates.Adding]: {
            entry: (context: ListContext, event: ListEvent) => {
                const ev = event as AddEvent;
                const highestExistingId = ev.items.reduce(
                    (highestId, currentValue) => (currentValue.id > highestId ? currentValue.id : highestId),
                    0
                );
                const result = [...ev.items, makeEmptyListItemData(highestExistingId + 1)];
                context.onItemsChanged(result);
            },
            always: ListStates.Idle,
        },
    },
});
