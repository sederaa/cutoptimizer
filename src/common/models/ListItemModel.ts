import { nameofFactory } from "common/utilities/nameofFactory";

export interface ListItemModel {
    id: number;
    name: string | undefined;
    length: number | null;
    quantity: number | null;
}

export const nameofListItemModel = nameofFactory<ListItemModel>();

export const makeEmptyListItemData = (id: number) =>
    ({ id, instanceId: 0, name: "", length: null, quantity: 1 } as ListItemModel);

export const isEmptyListItemData = (item: ListItemModel) => item.name === "" && item.length === null;
