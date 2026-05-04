import React from "react";
import styled from "styled-components";
import { List } from "common/components/List";
import { ListItemModel } from "common/models/ListItemModel";
import { CutModel } from "main/models/CutModel";
import { ModelErrorsArray } from "main/models/InputModel";
import { Heading } from "common/components/Heading";
import { Section } from "main/components/Section";

interface CutsProps {
    cuts: CutModel[];
    onCutsChanged: (cuts: CutModel[]) => void;
    errors?: ModelErrorsArray<CutModel>;
}

export const Cuts = ({ cuts, onCutsChanged, errors }: CutsProps) => {
    const handleItemsChanged = (items: ListItemModel[]) => {
        //console.debug(`Cuts: handleItemsChanged: items = `, items);
        onCutsChanged(items as CutModel[]);
    };
    return (
        <StyledCuts>
            <Heading as="h2">Cuts</Heading>
            Enter your cuts here
            <List items={cuts} onItemsChanged={handleItemsChanged} errors={errors} />
        </StyledCuts>
    );
};

const StyledCuts = styled(Section)`
    background-color: ${(props) => props.theme.colors.light};
`;
