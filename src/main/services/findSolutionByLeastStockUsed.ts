import { Node } from "main/services/createSolutionsTree";
import { StockModel } from "main/models/StockModel";

const getNodeLineage = (node: Node): Node[] => {
    if (node.parent === undefined || node.parent.stock === undefined || node.parent.cut === undefined) return [node];
    return [node, ...getNodeLineage(node.parent)];
};

export const findSolutionByLeastStockUsed = (node: Node) => {
    let leafNodeWithLowestStockUsed: Node | undefined = undefined;

    const findLeafNodeWithLowestStockUsed = (node: Node, stockIds: Set<number>) => {
        //console.debug(`findLeafNodeWithLowestStockUsed: node = `, node);
        if (!node._complete) return;
        let nodeStockIds = new Set(stockIds);
        if (node.stock) {
            nodeStockIds.add(node.stock.id);
        }
        node._stockUsed = nodeStockIds.size;
        if (node.children.length === 0) {
            if (
                leafNodeWithLowestStockUsed === undefined ||
                leafNodeWithLowestStockUsed._stockUsed === undefined ||
                node._stockUsed < leafNodeWithLowestStockUsed._stockUsed
            ) {
                leafNodeWithLowestStockUsed = node;
            }
        }
        for (const childNode of node.children) {
            findLeafNodeWithLowestStockUsed(childNode, nodeStockIds);
        }
    };
    findLeafNodeWithLowestStockUsed(node, new Set());
    //console.debug(`leafNodeWithLowestStockUsed = `, leafNodeWithLowestStockUsed);
    if (leafNodeWithLowestStockUsed === undefined) return undefined;

    const nodes = getNodeLineage(leafNodeWithLowestStockUsed);

    //console.debug(`leafNodeWithLowestStockUsed lineage = `, nodes);

    // Merge nodes for the same stock and return stocks with their cuts inside
    let stocks: StockModel[] = [];
    for (const node of nodes) {
        let index = stocks.findIndex((s) => s.instanceId === node.stock.instanceId);
        if (index > -1) {
            stocks[index]._cuts = [...(stocks[index]._cuts ?? []), node.cut];
        } else {
            stocks.push({ ...node.stock, _cuts: [node.cut] } as StockModel);
        }
    }

    console.debug(`merged stock nodes = `, stocks);
    return stocks;
};
