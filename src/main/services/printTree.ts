import { Node } from "main/services/createSolutionsTree";

export const printTree = (node: Node, level: number) => {
    const indent = " ".repeat(level * 3);
    console.log(
        `${indent}* CUT #${node?.cut?.instanceId} of '${node?.cut?.name}' #${node?.cut?.id} STOCK #${
            node?.stock?.instanceId
        } of '${node?.stock?.name}' #${node?.stock?.id} (len: ${node?.stock?._remainingLength}/${
            node?.stock?.length
        }, qty: ${node?.stock?._remainingQuantity}/${node?.stock?.quantity}, kerf: ${node?.stock?._totalKerf}) ${
            node._complete ? "COMPLETE" : ""
        }`
    );
    for (const childNode of node.children) {
        printTree(childNode, level + 1);
    }
};
