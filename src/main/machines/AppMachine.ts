import { Machine, assign } from "xstate";
import { createSolutionsTree } from "main/services/createSolutionsTree";
import { printTree } from "main/services/printTree";
import { BuyableStockModel } from "main/models/BuyableStockModel";
import { StockModel } from "main/models/StockModel";
import { CutModel } from "main/models/CutModel";
import set from "lodash.set";
import { findSolutionByLeastStockUsed } from "main/services/findSolutionByLeastStockUsed";
import { InputModel, InputModelValidationSchema, InputModelValidationErrors } from "main/models/InputModel";
import * as yup from "yup";
import { makeEmptyListItemData } from "common/models/ListItemModel";

interface AppMachineContext {
    input: InputModel;
    errors?: InputModelValidationErrors;
    solution?: StockModel[];
}

export enum AppMachineStates {
    Standby = "Standby",
    Validating = "Validating",
    Calculating = "Calculating",
}

interface AppMachineSchema {
    states: {
        [AppMachineStates.Standby]: {};
        [AppMachineStates.Validating]: {};
        [AppMachineStates.Calculating]: {};
    };
}

export enum AppMachineEvents {
    SetKerf = "SetKerf",
    SetCuts = "SetCuts",
    SetStock = "SetStock",
}
export type SetKerfEvent = { type: AppMachineEvents.SetKerf; kerf: number };
export type SetCutsEvent = { type: AppMachineEvents.SetCuts; cuts: CutModel[] };
export type SetStockEvent = { type: AppMachineEvents.SetStock; stock: StockModel[] };
type AppMachineEvent = SetKerfEvent | SetCutsEvent | SetStockEvent;

export const AppMachine = Machine<AppMachineContext, AppMachineSchema, AppMachineEvent>({
    initial: AppMachineStates.Standby,
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
        [AppMachineStates.Standby]: {
            on: {
                [AppMachineEvents.SetKerf]: {
                    actions: assign({
                        input: (context, event: SetKerfEvent) => ({ ...context.input, kerf: event.kerf }),
                        solution: (c) => undefined,
                    }),
                    target: AppMachineStates.Validating,
                },
                [AppMachineEvents.SetCuts]: {
                    actions: assign({
                        input: (context, event: SetCutsEvent) => ({ ...context.input, cuts: event.cuts }),
                        solution: (c) => undefined,
                    }),
                    target: AppMachineStates.Validating,
                },
                [AppMachineEvents.SetStock]: {
                    actions: assign({
                        input: (context, event: SetStockEvent) => ({
                            ...context.input,
                            stocks: event.stock,
                        }),
                        solution: (c) => undefined,
                    }),
                    target: AppMachineStates.Validating,
                },
            },
        },
        [AppMachineStates.Validating]: {
            invoke: {
                src: (context) => InputModelValidationSchema.validate(context.input, { abortEarly: false }),
                onDone: {
                    target: AppMachineStates.Calculating,
                    actions: [
                        //(context, event) => console.debug(`Validating: onDone: event = `, event),
                        assign({
                            errors: (context, event) => undefined,
                        }),
                    ],
                },
                onError: {
                    target: AppMachineStates.Standby,
                    actions: [
                        //(context, event) => console.debug(`Validating: onError: event = `, event),
                        assign({
                            errors: (context, event) =>
                                event.data.inner.reduce(
                                    (accumulator: any, e: yup.ValidationError) =>
                                        set(accumulator, e.path ?? "general", e.message),
                                    {}
                                ),
                        }),
                    ],
                },
            },
        },
        [AppMachineStates.Calculating]: {
            entry: assign((context) => {
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
            always: AppMachineStates.Standby,
        },
    },
});
