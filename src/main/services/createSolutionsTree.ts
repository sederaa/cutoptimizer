import { CutModel } from "../models/CutModel";
import { StockModel } from "../models/StockModel";
import { BuyableStockModel } from "../models/BuyableStockModel";
import range from "lodash.range";

export class Solution {
    stock!: StockModel[];
    wasteTotal!: number;
    wastePieces!: number;
    cost!: number;
}

export class Node {
    id!: number;
    cut!: CutModel;
    stock!: StockCalcModel;
    parent?: Node;
    children: Node[] = [];
    _stockUsed?: number;
    _complete: boolean = false;
}

interface StockCalcModel extends StockModel {
    _remainingLength: number;
    _remainingQuantity: number;
    _totalKerf: number;
}

const findStockItemInParents = (node: Node, stockId: number): StockCalcModel | undefined => {
    if (!node?.stock) return undefined;
    if (node.stock.id === stockId) return node.stock;
    if (!node.parent) return undefined;
    return findStockItemInParents(node.parent, stockId);
};

function* idMaker() {
    var index = 1;
    while (true) yield index++;
}

export const createSolutionsTree = (
    cuts: CutModel[],
    stocks: StockModel[],
    buyableStocks: BuyableStockModel[],
    kerf: number
): Node => {
    //console.debug(        `createSolutionsTree: cuts = `,        cuts,        `, stock = `,        stocks,        `, buyableStocks = `,        buyableStocks,        `, kerf = ${kerf}.`    );

    var nodeIdMaker = idMaker();
    var stockInstanceIdMaker = idMaker();
    var cutInstanceIdMaker = idMaker();

    let expandedCuts = cuts.flatMap((c) =>
        range(1, (c.quantity ?? 1) + 1).map((i) => ({
            ...c,
            id: c.id,
            instanceId: cutInstanceIdMaker.next().value as number,
        }))
    );
    // sort cuts by length ascending
    expandedCuts.sort((s1, s2) => (s1.length === s2.length ? 0 : s1.length < s2.length ? 1 : -1));
    //console.debug(`createSolutionsTree: expandedCuts sorted = `, expandedCuts);

    let calcStocks = stocks.map(
        (s) =>
            ({
                ...s,
                _remainingLength: s.length,
                _remainingQuantity: s.quantity,
            } as StockCalcModel)
    );
    const buyableStocksTemp = buyableStocks.map(
        (bs) =>
            ({
                ...bs,
                _remainingLength: bs.length,
                _remainingQuantity: Number.POSITIVE_INFINITY,
            } as StockCalcModel)
    );
    Array.prototype.push.apply(calcStocks, buyableStocksTemp);

    const root = new Node();
    root.id = nodeIdMaker.next().value as number;

    const buildTree = (node: Node, cutIndex: number): boolean => {
        //console.group(`buildTree: cutIndex = ${cutIndex}.`);
        if (cutIndex < 0) {
            //console.groupEnd();
            return true;
        }
        const cut = expandedCuts[cutIndex];
        //console.debug(`cut=`, cut);
        node.children = node.children ?? [];
        let completed: boolean = false;

        for (const stock of calcStocks) {
            // get this stock item from further up the chain, otherwise use stock
            const stockItem = findStockItemInParents(node, stock.id);
            //console.group(`stock=`, stock, `, stockItem=`, stockItem);
            // create node if it fits
            let clonedStockItem: StockCalcModel | undefined = undefined;
            if (stockItem && cut.length === stockItem._remainingLength - stockItem._totalKerf) {
                //console.debug( `Case 1: cut ${cut.name}#${cut.id} fits stockItem ${stockItem.name}#${stockItem.id} remaining length exactly.` );
                // Case 1: the segment fits the stock remaining length (inc. kerf) exactly
                clonedStockItem = {
                    ...stockItem,
                    _remainingLength: stockItem._remainingLength - cut.length,
                    _totalKerf: stockItem._totalKerf,
                } as StockCalcModel;
            } else if (stockItem && cut.length < stockItem._remainingLength - stockItem._totalKerf) {
                //console.debug( `Case 2: cut ${cut.name}#${cut.id} fits stockItem ${stockItem.name}#${stockItem.id} with remainder.` );
                // Case 2: the segment fits the stock remaining length (inc. kerf) with remainder
                clonedStockItem = {
                    ...stockItem,
                    _remainingLength: stockItem._remainingLength - cut.length,
                    _totalKerf: stockItem._totalKerf + kerf,
                } as StockCalcModel;
            } else if (stockItem && stockItem._remainingQuantity > 1 && cut.length === stock.length) {
                //console.debug( `Case 3: cut ${cut.name}#${cut.id} doesn't fit stockItem ${stockItem.name}#${stockItem.id} remaining length, but there is another stock ${stock.name}#${stock.id} we can use and the cut fits exactly.` );
                // Case 3: the segment doesn't fit the stock remaining length, but there is another stock item we can use and the segment fits exactly
                clonedStockItem = {
                    ...stock,
                    _remainingLength: stock._remainingLength - cut.length,
                    _remainingQuantity: stockItem._remainingQuantity - 1,
                    _totalKerf: 0,
                } as StockCalcModel;
            } else if (stockItem && stockItem._remainingQuantity > 1 && cut.length < stock.length) {
                //console.debug( `Case 4: cut ${cut.name}#${cut.id} doesn't fit stockItem ${stockItem.name}#${stockItem.id} remaining length, but there is another stock ${stock.name}#${stock.id} we can use and the cut fits with remainder.` );
                // Case 4: the segment doesn't fit the stock remaining length, but there is another stock item we can use and the segment fits with remainder
                clonedStockItem = {
                    ...stock,
                    _remainingLength: stock._remainingLength - cut.length,
                    _remainingQuantity: stockItem._remainingQuantity - 1,
                    _totalKerf: kerf,
                } as StockCalcModel;
            } else if (!stockItem && cut.length === stock.length) {
                //console.debug( `Case 5: this stock ${stock.name}#${stock.id} hasn't been used yet, and it fits the cut ${cut.name}#${cut.id} exactly.` );
                // Case 5: this stock hasn't been used yet, and it fits the first one exactly
                clonedStockItem = {
                    ...stock,
                    instanceId: stockInstanceIdMaker.next().value as number,
                    _remainingLength: stock._remainingLength - cut.length,
                    _totalKerf: 0,
                } as StockCalcModel;
            } else if (!stockItem && cut.length <= stock.length) {
                //console.debug( `Case 6: this stock ${stock.name}#${stock.id} hasn't been used yet, and it fits the cut ${cut.name}#${cut.id} with remainder.` );
                // Case 6: this stock hasn't been used yet, and it fits the first one with remainder
                clonedStockItem = {
                    ...stock,
                    instanceId: stockInstanceIdMaker.next().value as number,
                    _remainingLength: stock._remainingLength - cut.length,
                    _totalKerf: kerf,
                } as StockCalcModel;
            } else {
                //console.error( `Error: cut ${cut.name}#${cut.id} doesn't fit stockItem ${stockItem?.name}#${stockItem?.id} nor stock ${stock.name}#${stock.id} and there are no more stock to use.` );
            }

            if (clonedStockItem) {
                const newNode = {
                    id: nodeIdMaker.next().value as number,
                    stock: clonedStockItem,
                    cut: cut,
                    parent: node,
                    children: [],
                    _complete: cutIndex === 0,
                } as Node;
                node.children.push(newNode);
                //console.debug(`Adding node #${newNode.id} to node #${node.id}.`);
                let result = buildTree(newNode, cutIndex - 1);
                node._complete = result;
                completed = result ? true : completed;
            }
            //console.groupEnd();
        }

        root._complete = completed;

        //console.groupEnd();
        return completed;
    };

    buildTree(root, expandedCuts.length - 1);
    return root;
};
