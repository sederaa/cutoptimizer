import styled from "styled-components";
import { List } from "common/components/List";
import type { ListItemModel } from "common/models/ListItemModel";
import type { StockModel } from "main/models/StockModel";
import type { ModelErrorsArray } from "main/models/InputModel";
import { Heading } from "common/components/Heading";
import { Section } from "main/components/Section";

interface StockProps {
    stock: StockModel[];
    onStockChanged: (stock: StockModel[]) => void;
    errors?: ModelErrorsArray<StockModel>;
}
export const Stock = ({ stock, onStockChanged, errors }: StockProps) => {
    const handleItemsChanged = (items: ListItemModel[]) => {
        //console.debug(`Stock: handleItemsChanged: items = `, items);
        onStockChanged(items as StockModel[]);
    };
    return (
        <StyledStock>
            <Heading as="h2">Stock</Heading>
            Enter your Stock here
            <List items={stock} onItemsChanged={handleItemsChanged} errors={errors} />
        </StyledStock>
    );
};

const StyledStock = styled(Section)``;
