import React from "react";
import styled from "styled-components";
import { useMachine } from "@xstate/react";
import { ListMachine, ListEvents, UpdateFieldEvent, AddEvent, DeleteEvent } from "common/components/ListMachine";
import { ListItemModel } from "common/models/ListItemModel";
import { IntegerField } from "common/components/IntegerField";
import { Field } from "common/components/Field";
import constants from "constants.json";
import { StyledInput } from "common/components/StyledInput";
import { device } from "common/utilities/device";

interface ListProps {
    items: ListItemModel[];
    onItemsChanged: (items: ListItemModel[]) => void;
    errors?: Array<{ [Property in keyof ListItemModel]: string | undefined }>;
}

export const List = ({ items, onItemsChanged, errors }: ListProps) => {
    const [, sendEvent] = useMachine(ListMachine, { context: { onItemsChanged } });
    //console.debug(`state.context.items = `, state.context.items);

    const handleAddClick = () => {
        sendEvent({ type: ListEvents.Add, items } as AddEvent);
    };

    const handleDeleteItem = (id: number) => {
        sendEvent({ type: ListEvents.Delete, items, id } as DeleteEvent);
    };

    const handleUpdateField = (id: number, name: keyof Omit<ListItemModel, "id">, value: string) => {
        sendEvent({
            type: ListEvents.UpdateField,
            id,
            name,
            value,
            items,
        } as UpdateFieldEvent);
    };

    return (
        <>
            <StyledUnorderedList>
                {items.map((item, index) => (
                    <ListItem
                        key={item.id}
                        data={item}
                        handleDeleteItem={handleDeleteItem}
                        handleUpdateField={handleUpdateField}
                        errors={errors?.[index]}
                    />
                ))}
            </StyledUnorderedList>
            <StyledAddButton onClick={handleAddClick}>
                <span>+</span> Add
            </StyledAddButton>
        </>
    );
};

interface ListItemProps {
    data: ListItemModel;
    handleDeleteItem: (id: number) => void;
    handleUpdateField: (id: number, name: keyof Omit<ListItemModel, "id">, value: string) => void;
    errors: { [Property in keyof ListItemModel]: string | undefined } | undefined;
}

export const ListItem = ({ data, handleDeleteItem, handleUpdateField, errors }: ListItemProps) => {
    return (
        <StyledListItem>
            <Field id={`name-${data.id}`} label="Name">
                <StyledInput
                    type="text"
                    id={`name-${data.id}`}
                    name="name"
                    value={data.name}
                    onChange={(e) => handleUpdateField(data.id, "name", e.target.value)}
                    placeholder=" "
                    maxLength={constants.Entities.ListItem.Name.Maxlength}
                    style={errors?.["name"] ? { borderColor: "red" } : undefined}
                />
            </Field>
            <IntegerField
                id={`length-${data.id}`}
                name="length"
                label="Length"
                value={data.length ?? ""}
                min={constants.Entities.ListItem.Length.Min}
                max={constants.Entities.ListItem.Length.Max}
                error={errors?.["length"]}
                onChange={(value) => handleUpdateField(data.id, "length", value?.toString() ?? "")}
            />
            <IntegerField
                id={`quantity-${data.id}`}
                name="quantity"
                label="Quantity"
                value={data.quantity ?? ""}
                min={constants.Entities.ListItem.Quantity.Min}
                max={constants.Entities.ListItem.Quantity.Max}
                error={errors?.["quantity"]}
                onChange={(value) => handleUpdateField(data.id, "quantity", value?.toString() ?? "")}
            />
            <StyledDeleteButtonContainer>
                <StyledDeleteButton className="delete-button" onClick={() => handleDeleteItem(data.id)}>
                    &times;
                </StyledDeleteButton>
            </StyledDeleteButtonContainer>
        </StyledListItem>
    );
};

const StyledUnorderedList = styled.ul`
    list-style-type: none;
    padding: 0;
`;

const StyledListItem = styled.li`
    display: flex;
    flex-wrap: nowrap;
    flex-direction: column; // for small mobile
    margin-bottom: 0.5em;

    @media ${device.mobileL} {
        flex-direction: row; // for large mobile, tablet and desktop
        margin-bottom: 0;
    }

    & > * {
        margin: 0.3em 0.3em 0.3em 0;
    }
`;

const StyledDeleteButtonContainer = styled.div`
    text-align: center;
`;

const StyledDeleteButton = styled.button`
    border-radius: 3px;
    background-color: white;
    border-color: crimson;
    color: crimson;
    width: 34px;
    height: 34px;
    font-size: large;
    line-height: 0;
    vertical-align: bottom;
    cursor: pointer;
`;

const StyledAddButton = styled.button`
    color: rgb(32, 34, 35);
    border-radius: 3px;
    background-color: white;
    font-size: smaller;
    padding-left: 1.5em;
    height: 32px;
    padding-right: 1.5em;
    border-bottom-color: rgb(90, 90, 90);
    border-right-color: rgb(100, 100, 100);
    border-left-color: rgb(110, 110, 110);
    border-top-color: rgb(120, 120, 120);
    line-height: 0;
    text-transform: uppercase;
    cursor: pointer;

    & span {
        font-size: large;
        font-weight: bold;
    }
`;
