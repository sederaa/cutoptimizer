import { setup } from "xstate";
import { type ListItemModel, makeEmptyListItemData, nameofListItemModel } from "common/models/ListItemModel";

export type ListState = "Idle" | "Deleting" | "Adding" | "UpdatingField";

interface BaseEvent {
    type: "Add" | "Delete" | "UpdateField";
    items: ListItemModel[];
}

export interface DeleteEvent extends BaseEvent {
    type: "Delete";
    id: number;
}
export interface UpdateFieldEvent extends BaseEvent {
    type: "UpdateField";
    id: number;
    name: keyof Omit<ListItemModel, "id">;
    value: string;
}
export interface AddEvent extends BaseEvent {
    type: "Add";
}
type ListEvent = AddEvent | DeleteEvent | UpdateFieldEvent;

interface ListContext {
    onItemsChanged: (items: ListItemModel[]) => void;
}

type Input = Pick<ListContext, "onItemsChanged">;

const nullIfNaN = (value: number): number | null => {
    return Number.isNaN(value) ? null : value;
};

export const ListMachine = setup({
    types: {} as {
        context: ListContext;
        events: ListEvent;
        input: Input;
    },
    actions: {},
    guards: {},
}).createMachine({
    initial: "Idle",
    context: ({ input }) => ({
        onItemsChanged: input.onItemsChanged,
    }),
    states: {
        Idle: {
            on: {
                Add: {
                    target: "Adding",
                },
                Delete: {
                    target: "Deleting",
                },
                UpdateField: {
                    target: "UpdatingField",
                },
            },
        },
        UpdatingField: {
            entry: ({ context, event }) => {
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
            always: "Idle",
        },
        Deleting: {
            entry: ({ context, event }) => {
                const ev = event as DeleteEvent;
                let items = [...ev.items.filter((i) => i.id !== ev.id)];
                if (items.length === 0) items = [makeEmptyListItemData(0)];
                context.onItemsChanged(items);
            },
            always: "Idle",
        },
        Adding: {
            entry: ({ context, event }) => {
                const ev = event as AddEvent;
                const highestExistingId = ev.items.reduce(
                    (highestId, currentValue) => (currentValue.id > highestId ? currentValue.id : highestId),
                    0
                );
                const result = [...ev.items, makeEmptyListItemData(highestExistingId + 1)];
                context.onItemsChanged(result);
            },
            always: "Idle",
        },
    },
});
