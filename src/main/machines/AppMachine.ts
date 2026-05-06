import { setup, assign, fromPromise } from "xstate";
import { createSolutionsTree } from "main/services/createSolutionsTree";
import { printTree } from "main/services/printTree";
import type { BuyableStockModel } from "main/models/BuyableStockModel";
import type { StockModel } from "main/models/StockModel";
import type { CutModel } from "main/models/CutModel";
import set from "lodash.set";
import { findSolutionByLeastStockUsed } from "main/services/findSolutionByLeastStockUsed";
import { type InputModel, InputModelValidationSchema, type InputModelValidationErrors } from "main/models/InputModel";
import * as yup from "yup";
import { makeEmptyListItemData } from "common/models/ListItemModel";

interface AppMachineContext {
    input: InputModel;
    errors?: InputModelValidationErrors;
    solution?: StockModel[];
}

export type SetKerfEvent = { type: "SetKerf"; kerf: number };
export type SetCutsEvent = { type: "SetCuts"; cuts: CutModel[] };
export type SetStockEvent = { type: "SetStock"; stock: StockModel[] };
type AppMachineEvent = SetKerfEvent | SetCutsEvent | SetStockEvent;

export const AppMachine = setup({
    types: {} as {
        context: AppMachineContext;
        events: AppMachineEvent;
    },
    actions: {},
    guards: {},
    actors: {
        validateInput: fromPromise(async ({ input }: { input: InputModel }) =>
            InputModelValidationSchema.validate(input, { abortEarly: false })
        ),
    },
}).createMachine({
    initial: "Standby",
    context: {
        input: {
            cuts: [makeEmptyListItemData(0)] as CutModel[],
            stocks: [makeEmptyListItemData(0)] as StockModel[],
            /*

            cuts: [
                { id: 1, name: "c1", length: 5, quantity: 1 } as CutModel,
                { id: 2, name: "c2", length: 10, quantity: 1 } as CutModel,
                { id: 3, name: "c3", length: 15, quantity: 1 } as CutModel,
            ],
            stocks: [
                { id: 10, name: "s1", length: 20, quantity: 1, instanceId: 0 } as StockModel,
                { id: 11, name: "s2", length: 10, quantity: 1, instanceId: 0 } as StockModel,
            ],
            */

            buyableStocks: [] as BuyableStockModel[],
            kerf: 0,
        },
    },
    states: {
        Standby: {
            on: {
                SetKerf: {
                    actions: assign({
                        input: ({ context, event /*: SetKerfEvent*/ }) => ({ ...context.input, kerf: event.kerf }),
                        solution: () => undefined,
                    }),
                    target: "Validating",
                },
                SetCuts: {
                    actions: assign({
                        input: ({ context, event /*: SetCutsEvent*/ }) => ({ ...context.input, cuts: event.cuts }),
                        solution: () => undefined,
                    }),
                    target: "Validating",
                },
                SetStock: {
                    actions: assign({
                        input: ({ context, event /*: SetStockEvent*/ }) => ({
                            ...context.input,
                            stocks: event.stock,
                        }),
                        solution: () => undefined,
                    }),
                    target: "Validating",
                },
            },
        },
        Validating: {
            invoke: {
                src: "validateInput",
                input: ({ context }) => context.input,
                onDone: {
                    target: "Calculating",
                    actions: [
                        //({ context, event }) => console.debug(`Validating: onDone: event = `, event),
                        assign({
                            errors: () => undefined,
                        }),
                    ],
                },
                onError: {
                    target: "Standby",
                    actions: [
                        //({ context, event }) => console.debug(`Validating: onError: event = `, event),
                        assign({
                            errors: ({ event }) =>
                                ((event.error as yup.ValidationError).inner ?? []).reduce(
                                    (accumulator: any, e: yup.ValidationError) =>
                                        set(accumulator, e.path ?? "general", e.message),
                                    {}
                                ),
                        }),
                    ],
                },
            },
        },
        Calculating: {
            entry: assign(({ context }) => {
                //console.debug(`AppMachineStates.Calculating: calling createSolutionsTree...`);
                const treeRootNode = createSolutionsTree(
                    context.input.cuts,
                    context.input.stocks,
                    context.input.buyableStocks,
                    context.input.kerf
                );
                printTree(treeRootNode, 0);
                const stocks = findSolutionByLeastStockUsed(treeRootNode);
                return { solution: stocks };
            }),
            always: "Standby",
        },
    },
});
